import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Role } from '@prisma/client';

@Injectable()
export class MembersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(profileId: number) {
    const member = await this.prisma.member.findUnique({
      where: { id: profileId },
      include: { user: { select: { id: true, username: true, role: true } } },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan');
    return {
      statusCode: 200,
      success: true,
      message: 'Profil member berhasil diambil',
      data: member,
    };
  }

  async updateProfile(profileId: number, dto: UpdateMemberDto) {
    const member = await this.prisma.member.findUnique({ where: { id: profileId } });
    if (!member) throw new NotFoundException('Member tidak ditemukan');

    if (dto.username && member.id_user) {
      const dup = await this.prisma.user.findFirst({
        where: { username: dto.username, id: { not: member.id_user } },
      });
      if (dup) throw new BadRequestException('Username sudah digunakan');
    }

    const data: any = {};
    if (dto.nama_member !== undefined) data.nama_member = dto.nama_member;
    if (dto.instansi !== undefined) data.instansi = dto.instansi;
    if (dto.alamat !== undefined) data.alamat = dto.alamat;
    if (dto.telp !== undefined) data.telp = dto.telp;
    if (dto.foto !== undefined) data.foto = dto.foto;

    const updated = await this.prisma.member.update({
      where: { id: profileId },
      data,
    });

    if (member.id_user && (dto.username || dto.password)) {
      const userData: any = {};
      if (dto.username) userData.username = dto.username;
      if (dto.password) userData.password = await bcrypt.hash(dto.password, 10);
      if (Object.keys(userData).length) {
        await this.prisma.user.update({ where: { id: member.id_user }, data: userData });
      }
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Profil member berhasil diperbarui',
      data: updated,
    };
  }

  // ======== Admin CRUD ========

  async findAll() {
    const members = await this.prisma.member.findMany({
      include: { user: { select: { id: true, username: true, role: true } } },
      orderBy: { id: 'asc' },
    });
    return {
      statusCode: 200,
      success: true,
      message: 'Daftar member berhasil diambil',
      data: members,
    };
  }

  async findById(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true, role: true } } },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan');
    return {
      statusCode: 200,
      success: true,
      message: 'Detail member berhasil diambil',
      data: member,
    };
  }

  async create(dto: CreateMemberDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existing) throw new BadRequestException('Username sudah digunakan');

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: await bcrypt.hash(dto.password, 10),
        role: Role.MEMBER,
      },
    });

    const member = await this.prisma.member.create({
      data: {
        id_user: user.id,
        nama_member: dto.nama_member,
        instansi: dto.instansi ?? null,
        alamat: dto.alamat ?? null,
        telp: dto.telp ?? null,
        foto: dto.foto ?? null,
      },
    });

    return {
      statusCode: 201,
      success: true,
      message: 'Member berhasil ditambahkan',
      data: member,
    };
  }

  async update(id: number, dto: UpdateMemberDto) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Member tidak ditemukan');

    if (dto.username && member.id_user) {
      const dup = await this.prisma.user.findFirst({
        where: { username: dto.username, id: { not: member.id_user } },
      });
      if (dup) throw new BadRequestException('Username sudah digunakan');
    }

    const data: any = {};
    if (dto.nama_member !== undefined) data.nama_member = dto.nama_member;
    if (dto.instansi !== undefined) data.instansi = dto.instansi;
    if (dto.alamat !== undefined) data.alamat = dto.alamat;
    if (dto.telp !== undefined) data.telp = dto.telp;
    if (dto.foto !== undefined) data.foto = dto.foto;

    const updated = await this.prisma.member.update({ where: { id }, data });

    if (member.id_user && (dto.username || dto.password)) {
      const userData: any = {};
      if (dto.username) userData.username = dto.username;
      if (dto.password) userData.password = await bcrypt.hash(dto.password, 10);
      if (Object.keys(userData).length) {
        await this.prisma.user.update({ where: { id: member.id_user }, data: userData });
      }
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Member berhasil diperbarui',
      data: updated,
    };
  }

  async remove(id: number) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Member tidak ditemukan');

    await this.prisma.member.delete({ where: { id } });
    if (member.id_user) {
      await this.prisma.user.delete({ where: { id: member.id_user } });
    }

    return {
      statusCode: 200,
      success: true,
      message: 'Member berhasil dihapus',
      data: null,
    };
  }
}
