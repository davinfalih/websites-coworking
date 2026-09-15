import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';
import { CreateReservasiDto } from './dto/create-reservasi.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ReservasiStatus } from '@prisma/client';

@Injectable()
export class ReservasiService {
  constructor(private prisma: PrismaService) {}

  async create(memberId: number, dto: CreateReservasiDto) {
    const member = await this.prisma.member.findUnique({ where: { id: memberId } });
    if (!member) throw new NotFoundException('Member tidak ditemukan');

    const owner = await this.prisma.spaceOwner.findUnique({ where: { id: dto.id_owner } });
    if (!owner) throw new NotFoundException('Space owner tidak ditemukan');

    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Minimal satu space harus dipilih');
    }

    const kodeReservasi = this.generateKodeReservasi(dto.tanggal_reservasi);

    const reservasi = await this.prisma.$transaction(async (tx) => {
      // Buat header reservasi
      const header = await tx.reservasi.create({
        data: {
          tanggal_reservasi: new Date(dto.tanggal_reservasi),
          jam_mulai: dto.jam_mulai,
          durasi_jam: dto.durasi_jam,
          status: ReservasiStatus.BELUM_DIKONFIRM,
          kode_reservasi: kodeReservasi,
          id_owner: dto.id_owner,
          id_member: memberId,
        },
      });

      // Proses tiap item space
      for (const item of dto.items) {
        const space = await tx.space.findUnique({ where: { id: item.id_space } });
        if (!space) {
          throw new BadRequestException(`Space ${item.id_space} tidak ditemukan`);
        }
        if (space.id_owner !== dto.id_owner) {
          throw new BadRequestException('Space tidak dimiliki oleh owner ini');
        }

        // Validasi tumpang tindih jadwal
        await this.assertNoConflict(tx, space.id, dto);

        let diskon = null;
        if (item.kode_diskon) {
          diskon = await this.validateDiskon(item.kode_diskon);
        }

        const baseHarga = space.harga_per_jam * dto.durasi_jam;
        const jumlahDiskon = diskon ? diskon.persentase_diskon : 0;
        const totalHarga = baseHarga - (baseHarga * jumlahDiskon) / 100;

        await tx.detailReservasi.create({
          data: {
            id_reservasi: header.id,
            id_space: space.id,
            id_diskon: diskon ? diskon.id : null,
            total_harga: Number(totalHarga.toFixed(2)),
          },
        });
      }

      return tx.reservasi.findUnique({
        where: { id: header.id },
        include: {
          member: { select: { id: true, nama_member: true } },
          owner: { select: { id: true, nama_coworking: true } },
          details: { include: { space: true, diskon: true } },
        },
      });
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Reservasi berhasil dibuat. Silakan menunggu konfirmasi pengelola.',
      data: reservasi,
    };
  }

  private async assertNoConflict(tx: any, spaceId: number, dto: CreateReservasiDto) {
    const startDate = new Date(dto.tanggal_reservasi);
    const startTime = dto.jam_mulai;
    const durasi = dto.durasi_jam;

    // Ambil semua detail yang space-nya sama & status masih aktif/dipesan
    const details = await tx.detailReservasi.findMany({
      where: { id_space: spaceId },
      include: { reservasi: true },
    });

    for (const det of details) {
      const r = det.reservasi;
      if (!r) continue;
      if (
        r.status === ReservasiStatus.DIBATALKAN ||
        r.status === ReservasiStatus.SELESAI
      ) {
        continue;
      }
      const sameDay =
        new Date(r.tanggal_reservasi).toDateString() === startDate.toDateString();
      if (!sameDay) continue;

      // parse jam_mulai (HH:mm) ke menit
      const toMinutes = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + (m || 0);
      };
      const existingStart = toMinutes(r.jam_mulai);
      const existingEnd = existingStart + r.durasi_jam * 60;
      const newStart = toMinutes(startTime);
      const newEnd = newStart + durasi * 60;

      const overlap = newStart < existingEnd && newEnd > existingStart;
      if (overlap) {
        throw new BadRequestException(
          `Space sudah direservasi pada rentang jam ${r.jam_mulai} (${
            r.durasi_jam
          } jam). Silakan pilih jam lain.`,
        );
      }
    }
  }

  private async validateDiskon(kode: string) {
    const diskon = await this.prisma.diskon.findUnique({
      where: { kode_diskon: kode.toUpperCase() },
    });
    if (!diskon) {
      throw new NotFoundException('Kode diskon tidak valid atau tidak ditemukan');
    }
    const now = new Date();
    if (now < new Date(diskon.tanggal_awal)) {
      throw new BadRequestException('Masa berlaku diskon belum dimulai');
    }
    if (now > new Date(diskon.tanggal_akhir)) {
      throw new BadRequestException('Kode diskon sudah kadaluarsa');
    }
    return diskon;
  }

  async findAll(filter: {
    status?: ReservasiStatus;
    month?: string;
    ownerId?: number;
    memberId?: number;
  }) {
    const where: any = {};

    if (filter.status) where.status = filter.status;
    if (filter.ownerId) where.id_owner = filter.ownerId;
    if (filter.memberId) where.id_member = filter.memberId;
    if (filter.month) {
      const s = new Date(`${filter.month}-01 00:00:00`);
      const e = new Date(s);
      e.setMonth(e.getMonth() + 1);
      where.tanggal_reservasi = { gte: s, lt: e } as any;
    }

    const data = await this.prisma.reservasi.findMany({
      where,
      include: {
        member: { select: { id: true, nama_member: true } },
        owner: { select: { id: true, nama_coworking: true } },
        details: { include: { space: true, diskon: true } },
      },
      orderBy: { tanggal_reservasi: 'desc' },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Daftar reservasi berhasil diambil',
      data,
    };
  }

  async getDetail(id: number) {
    const reservasi = await this.prisma.reservasi.findUnique({
      where: { id },
      include: {
        member: { select: { id: true, nama_member: true, telp: true } },
        owner: { select: { id: true, nama_coworking: true, nama_pemilik: true } },
        details: { include: { space: true, diskon: true } },
      },
    });
    if (!reservasi) throw new NotFoundException('Reservasi tidak ditemukan');
    return {
      statusCode: 200,
      success: true,
      message: 'Detail reservasi berhasil diambil',
      data: reservasi,
    };
  }

  async updateStatus(id: number, dto: UpdateStatusDto, role: string) {
    const reservasi = await this.prisma.reservasi.findUnique({ where: { id } });
    if (!reservasi) throw new NotFoundException('Reservasi tidak ditemukan');

    // Member hanya bisa membatalkan
    if (role === 'MEMBER' && dto.status !== ReservasiStatus.DIBATALKAN) {
      throw new BadRequestException('Member hanya dapat membatalkan reservasi');
    }

    const validTransitions: Record<ReservasiStatus, ReservasiStatus[]> = {
      [ReservasiStatus.BELUM_DIKONFIRM]: [
        ReservasiStatus.DISETUJUI,
        ReservasiStatus.DIBATALKAN,
      ],
      [ReservasiStatus.DISETUJUI]: [
        ReservasiStatus.AKTIF,
        ReservasiStatus.DIBATALKAN,
      ],
      [ReservasiStatus.AKTIF]: [ReservasiStatus.SELESAI],
      [ReservasiStatus.SELESAI]: [],
      [ReservasiStatus.DIBATALKAN]: [],
    };

    if (!validTransitions[reservasi.status]?.includes(dto.status)) {
      throw new BadRequestException(
        `Tidak dapat mengubah status dari ${reservasi.status} menjadi ${dto.status}`,
      );
    }

    const updated = await this.prisma.reservasi.update({
      where: { id },
      data: { status: dto.status },
    });

    return {
      statusCode: 200,
      success: true,
      message: `Status reservasi berhasil diubah menjadi ${dto.status}`,
      data: updated,
    };
  }

  async checkIn(id: number) {
    const reservasi = await this.prisma.reservasi.findUnique({ where: { id } });
    if (!reservasi) throw new NotFoundException('Reservasi tidak ditemukan');
    if (reservasi.status !== ReservasiStatus.DISETUJUI) {
      throw new BadRequestException(
        'Check-in hanya dapat dilakukan saat status Disetujui',
      );
    }
    const updated = await this.prisma.reservasi.update({
      where: { id },
      data: { status: ReservasiStatus.AKTIF, check_in_at: new Date() },
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Check-in berhasil. Status reservasi menjadi Aktif.',
      data: updated,
    };
  }

  async checkOut(id: number) {
    const reservasi = await this.prisma.reservasi.findUnique({ where: { id } });
    if (!reservasi) throw new NotFoundException('Reservasi tidak ditemukan');
    if (reservasi.status !== ReservasiStatus.AKTIF) {
      throw new BadRequestException('Check-out hanya dapat dilakukan saat status Aktif');
    }
    const updated = await this.prisma.reservasi.update({
      where: { id },
      data: { status: ReservasiStatus.SELESAI, check_out_at: new Date() },
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Check-out berhasil. Status reservasi menjadi Selesai.',
      data: updated,
    };
  }

  async generateEticket(id: number) {
    const { data: reservasi } = await this.getDetail(id) as any;

    const qrData = JSON.stringify({
      kode_reservasi: reservasi.kode_reservasi,
      id: reservasi.id,
      nama_member: reservasi.member?.nama_member,
      nama_coworking: reservasi.owner?.nama_coworking,
      tanggal: reservasi.tanggal_reservasi,
      jam_mulai: reservasi.jam_mulai,
      durasi_jam: reservasi.durasi_jam,
      status: reservasi.status,
    });
    const qrCode = await QRCode.toDataURL(qrData);

    return {
      statusCode: 200,
      success: true,
      message: 'E-ticket berhasil dibuat',
      data: { ...reservasi, qr_code: qrCode },
    };
  }

  private generateKodeReservasi(tanggal: Date | string): string {
    const d = new Date(tanggal);
    const ymd =
      d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, '0') +
      String(d.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `RSV-${ymd}-${random}`;
  }
}
