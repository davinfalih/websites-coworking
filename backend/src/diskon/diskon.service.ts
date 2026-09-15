import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDiskonDto } from './dto/create-diskon.dto';
import { UpdateDiskonDto } from './dto/update-diskon.dto';

@Injectable()
export class DiskonService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const diskons = await this.prisma.diskon.findMany({
      orderBy: { id: 'desc' },
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Daftar diskon berhasil diambil',
      data: diskons,
    };
  }

  async findById(id: number) {
    const diskon = await this.prisma.diskon.findUnique({ where: { id } });
    if (!diskon) throw new NotFoundException('Diskon tidak ditemukan');
    return {
      statusCode: 200,
      success: true,
      message: 'Detail diskon berhasil diambil',
      data: diskon,
    };
  }

  async findByKode(kode: string) {
    return this.prisma.diskon.findUnique({
      where: { kode_diskon: kode.toUpperCase() },
    });
  }

  async create(dto: CreateDiskonDto) {
    const kode = dto.kode_diskon.toUpperCase();
    const existing = await this.prisma.diskon.findUnique({ where: { kode_diskon: kode } });
    if (existing) throw new BadRequestException('Kode diskon sudah terdaftar');

    const diskon = await this.prisma.diskon.create({
      data: {
        kode_diskon: kode,
        nama_diskon: dto.nama_diskon,
        persentase_diskon: dto.persentase_diskon,
        tanggal_awal: new Date(dto.tanggal_awal),
        tanggal_akhir: new Date(dto.tanggal_akhir),
      },
    });
    return {
      statusCode: 201,
      success: true,
      message: 'Diskon berhasil ditambahkan',
      data: diskon,
    };
  }

  async update(id: number, dto: UpdateDiskonDto) {
    const existing = await this.prisma.diskon.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Diskon tidak ditemukan');

    if (dto.kode_diskon) {
      const dup = await this.prisma.diskon.findFirst({
        where: { kode_diskon: dto.kode_diskon.toUpperCase(), id: { not: id } },
      });
      if (dup) throw new BadRequestException('Kode diskon sudah terdaftar');
    }

    const data: any = {};
    if (dto.kode_diskon !== undefined) data.kode_diskon = dto.kode_diskon.toUpperCase();
    if (dto.nama_diskon !== undefined) data.nama_diskon = dto.nama_diskon;
    if (dto.persentase_diskon !== undefined) data.persentase_diskon = dto.persentase_diskon;
    if (dto.tanggal_awal !== undefined) data.tanggal_awal = new Date(dto.tanggal_awal);
    if (dto.tanggal_akhir !== undefined) data.tanggal_akhir = new Date(dto.tanggal_akhir);

    const updated = await this.prisma.diskon.update({ where: { id }, data });
    return {
      statusCode: 200,
      success: true,
      message: 'Diskon berhasil diperbarui',
      data: updated,
    };
  }

  async remove(id: number) {
    const existing = await this.prisma.diskon.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Diskon tidak ditemukan');

    await this.prisma.diskon.delete({ where: { id } });
    return {
      statusCode: 200,
      success: true,
      message: 'Diskon berhasil dihapus',
      data: null,
    };
  }
}
