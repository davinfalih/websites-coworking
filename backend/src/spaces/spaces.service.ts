import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';

@Injectable()
export class SpacesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const spaces = await this.prisma.space.findMany({
      include: { owner: { select: { id: true, nama_coworking: true, nama_pemilik: true } } },
      orderBy: { id: 'asc' },
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Daftar space berhasil diambil',
      data: spaces,
    };
  }

  async findByOwner(ownerId: number) {
    const spaces = await this.prisma.space.findMany({
      where: { id_owner: ownerId },
      include: { owner: { select: { id: true, nama_coworking: true } } },
      orderBy: { id: 'asc' },
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Daftar space milik Anda berhasil diambil',
      data: spaces,
    };
  }

  async findById(id: number) {
    const space = await this.prisma.space.findUnique({
      where: { id },
      include: { owner: { select: { id: true, nama_coworking: true, nama_pemilik: true } } },
    });
    if (!space) throw new NotFoundException('Space tidak ditemukan');
    return {
      statusCode: 200,
      success: true,
      message: 'Detail space berhasil diambil',
      data: space,
    };
  }

  async create(ownerId: number, dto: CreateSpaceDto) {
    const space = await this.prisma.space.create({
      data: {
        id_owner: ownerId,
        nama_space: dto.nama_space,
        harga_per_jam: dto.harga_per_jam,
        tipe: dto.tipe,
        kapasitas: dto.kapasitas,
        deskripsi: dto.deskripsi ?? null,
        foto: dto.foto ?? null,
      },
    });
    return {
      statusCode: 201,
      success: true,
      message: 'Space berhasil ditambahkan',
      data: space,
    };
  }

  async update(id: number, dto: UpdateSpaceDto) {
    const existing = await this.prisma.space.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Space tidak ditemukan');

    const data: any = {};
    if (dto.nama_space !== undefined) data.nama_space = dto.nama_space;
    if (dto.harga_per_jam !== undefined) data.harga_per_jam = dto.harga_per_jam;
    if (dto.tipe !== undefined) data.tipe = dto.tipe;
    if (dto.kapasitas !== undefined) data.kapasitas = dto.kapasitas;
    if (dto.deskripsi !== undefined) data.deskripsi = dto.deskripsi;
    if (dto.foto !== undefined) data.foto = dto.foto;

    const updated = await this.prisma.space.update({ where: { id }, data });
    return {
      statusCode: 200,
      success: true,
      message: 'Space berhasil diperbarui',
      data: updated,
    };
  }

  async remove(id: number) {
    const existing = await this.prisma.space.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Space tidak ditemukan');

    await this.prisma.space.delete({ where: { id } });
    return {
      statusCode: 200,
      success: true,
      message: 'Space berhasil dihapus',
      data: null,
    };
  }
}
