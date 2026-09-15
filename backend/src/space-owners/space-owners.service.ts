import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { Role } from '@prisma/client';

@Injectable()
export class SpaceOwnersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(profileId: number) {
    const owner = await this.prisma.spaceOwner.findUnique({
      where: { id: profileId },
      include: { user: { select: { id: true, username: true, role: true } } },
    });
    if (!owner) throw new NotFoundException('Space owner tidak ditemukan');
    return {
      statusCode: 200,
      success: true,
      message: 'Profil pengelola space berhasil diambil',
      data: owner,
    };
  }

  async updateProfile(profileId: number, dto: UpdateOwnerDto) {
    const owner = await this.prisma.spaceOwner.findUnique({ where: { id: profileId } });
    if (!owner) throw new NotFoundException('Space owner tidak ditemukan');

    if (dto.username && owner.id_user) {
      const dup = await this.prisma.user.findFirst({
        where: { username: dto.username, id: { not: owner.id_user } },
      });
      if (dup) throw new BadRequestException('Username sudah digunakan');
    }

    const data: any = {};
    if (dto.nama_coworking !== undefined) data.nama_coworking = dto.nama_coworking;
    if (dto.nama_pemilik !== undefined) data.nama_pemilik = dto.nama_pemilik;
    if (dto.telp !== undefined) data.telp = dto.telp;

    const updated = await this.prisma.spaceOwner.update({ where: { id: profileId }, data });

    if (owner.id_user && (dto.username || dto.password)) {
      const userData: any = {};
      if (dto.username) userData.username = dto.username;
      if (dto.password) userData.password = await bcrypt.hash(dto.password, 10);
      if (Object.keys(userData).length) {
        await this.prisma.user.update({ where: { id: owner.id_user }, data: userData });
      }
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Profil pengelola space berhasil diperbarui',
      data: updated,
    };
  }

  // ======== Admin CRUD ========

  async findAll() {
    const owners = await this.prisma.spaceOwner.findMany({
      include: { user: { select: { id: true, username: true, role: true } } },
      orderBy: { id: 'asc' },
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Daftar pengelola space berhasil diambil',
      data: owners,
    };
  }

  async findById(id: number) {
    const owner = await this.prisma.spaceOwner.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true, role: true } } },
    });
    if (!owner) throw new NotFoundException('Space owner tidak ditemukan');
    return {
      statusCode: 200,
      success: true,
      message: 'Detail pengelola space berhasil diambil',
      data: owner,
    };
  }

  async create(dto: CreateOwnerDto) {
    const existing = await this.prisma.user.findUnique({ where: { username: dto.username } });
    if (existing) throw new BadRequestException('Username sudah digunakan');

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: await bcrypt.hash(dto.password, 10),
        role: Role.ADMIN_SPACE,
      },
    });

    const owner = await this.prisma.spaceOwner.create({
      data: {
        id_user: user.id,
        nama_coworking: dto.nama_coworking,
        nama_pemilik: dto.nama_pemilik,
        telp: dto.telp ?? null,
      },
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Pengelola space berhasil ditambahkan',
      data: owner,
    };
  }

  async update(id: number, dto: UpdateOwnerDto) {
    const owner = await this.prisma.spaceOwner.findUnique({ where: { id } });
    if (!owner) throw new NotFoundException('Space owner tidak ditemukan');

    if (dto.username && owner.id_user) {
      const dup = await this.prisma.user.findFirst({
        where: { username: dto.username, id: { not: owner.id_user } },
      });
      if (dup) throw new BadRequestException('Username sudah digunakan');
    }

    const data: any = {};
    if (dto.nama_coworking !== undefined) data.nama_coworking = dto.nama_coworking;
    if (dto.nama_pemilik !== undefined) data.nama_pemilik = dto.nama_pemilik;
    if (dto.telp !== undefined) data.telp = dto.telp;

    const updated = await this.prisma.spaceOwner.update({ where: { id }, data });

    if (owner.id_user && (dto.username || dto.password)) {
      const userData: any = {};
      if (dto.username) userData.username = dto.username;
      if (dto.password) userData.password = await bcrypt.hash(dto.password, 10);
      if (Object.keys(userData).length) {
        await this.prisma.user.update({ where: { id: owner.id_user }, data: userData });
      }
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Pengelola space berhasil diperbarui',
      data: updated,
    };
  }

  async remove(id: number) {
    const owner = await this.prisma.spaceOwner.findUnique({ where: { id } });
    if (!owner) throw new NotFoundException('Space owner tidak ditemukan');

    await this.prisma.spaceOwner.delete({ where: { id } });
    if (owner.id_user) {
      await this.prisma.user.delete({ where: { id: owner.id_user } });
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Pengelola space berhasil dihapus',
      data: null,
    };
  }
}
