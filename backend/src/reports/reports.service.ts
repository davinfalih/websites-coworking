import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReservasiStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async revenuePerMonth(ownerId?: number) {
    const statusExcluded = [ReservasiStatus.DIBATALKAN, ReservasiStatus.BELUM_DIKONFIRM]
      .map((s) => `'${s}'`)
      .join(', ');

    const whereOwner = ownerId ? `AND r.id_owner = ${Number(ownerId)}` : '';

    const rows: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT
        DATE_FORMAT(r.tanggal_reservasi, '%Y-%m') AS bulan,
        COUNT(r.id) AS jumlah_reservasi,
        COALESCE(SUM(d.total_harga), 0) AS pendapatan
      FROM Reservasi r
      LEFT JOIN DetailReservasi d ON d.id_reservasi = r.id
      WHERE r.status NOT IN (${statusExcluded})
      ${whereOwner}
      GROUP BY bulan
      ORDER BY bulan DESC
    `);

    return {
      statusCode: 200,
      success: true,
      message: 'Rekapitulasi pendapatan per bulan berhasil diambil',
      data: rows.map((r) => ({
        bulan: r.bulan,
        jumlah_reservasi: Number(r.jumlah_reservasi),
        pendapatan: Number(r.pendapatan),
      })),
    };
  }

  async revenuePerSpaceType(ownerId?: number) {
    const statusExcluded = [ReservasiStatus.DIBATALKAN, ReservasiStatus.BELUM_DIKONFIRM]
      .map((s) => `'${s}'`)
      .join(', ');

    const whereOwner = ownerId ? `AND r.id_owner = ${Number(ownerId)}` : '';

    const rows: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT
        s.tipe AS tipe,
        COUNT(d.id) AS jumlah,
        COALESCE(SUM(d.total_harga), 0) AS pendapatan
      FROM DetailReservasi d
      LEFT JOIN Space s ON s.id = d.id_space
      LEFT JOIN Reservasi r ON r.id = d.id_reservasi
      WHERE s.tipe IS NOT NULL
        AND r.status NOT IN (${statusExcluded})
      ${whereOwner}
      GROUP BY s.tipe
    `);

    const label: Record<string, string> = {
      DESK: 'Personal Desk',
      MEETING_ROOM: 'Meeting Room',
      PRIVATE_OFFICE: 'Private Office',
    };

    return {
      statusCode: 200,
      success: true,
      message: 'Distribusi pendapatan per jenis space berhasil diambil',
      data: rows.map((r) => ({
        tipe: r.tipe,
        label: label[r.tipe] ?? r.tipe,
        jumlah: Number(r.jumlah),
        pendapatan: Number(r.pendapatan),
      })),
    };
  }

  async dashboardSummary(ownerId?: number) {
    const [totalReservasi, statusCounts, revenue] = await Promise.all([
      this.prisma.reservasi.count({
        ...(ownerId ? { where: { id_owner: ownerId } } : {}),
      }),
      this.countByStatus(ownerId),
      this.revenuePerMonth(ownerId),
    ]);

    return {
      statusCode: 200,
      success: true,
      message: 'Ringkasan dashboard berhasil diambil',
      data: {
        total_reservasi: totalReservasi,
        status: statusCounts,
        total_pendapatan: revenue.data.reduce(
          (acc: number, r: any) => acc + r.pendapatan,
          0,
        ),
        pendapatan_per_bulan: revenue.data,
      },
    };
  }

  private async countByStatus(ownerId?: number) {
    const whereOwner = ownerId ? `WHERE r.id_owner = ${Number(ownerId)}` : '';
    const rows: any[] = await this.prisma.$queryRawUnsafe(`
      SELECT r.status AS status, COUNT(r.id) AS jumlah
      FROM Reservasi r
      ${whereOwner}
      GROUP BY r.status
    `);
    const result: Record<string, number> = {};
    for (const row of rows) {
      result[row.status] = Number(row.jumlah);
    }
    return result;
  }
}
