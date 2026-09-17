import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterMemberDto } from './dto/register-member.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerMember(dto: RegisterMemberDto) {
    const existing = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existing) {
      throw new BadRequestException('Username sudah digunakan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
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
      },
    });

    return {
      statusCode: 201,
      message: 'Registrasi member berhasil! Akun Anda telah dibuat.',
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        member: {
          id: member.id,
          nama_member: member.nama_member,
          instansi: member.instansi,
        },
      },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Username atau password salah');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Username atau password salah');
    }

    let profileId: number | null = null;
    if (user.role === Role.MEMBER) {
      const member = await this.prisma.member.findUnique({
        where: { id_user: user.id },
      });
      profileId = member?.id ?? null;
    } else if (user.role === Role.ADMIN_SPACE) {
      const owner = await this.prisma.spaceOwner.findUnique({
        where: { id_user: user.id },
      });
      profileId = owner?.id ?? null;
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      profileId,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      statusCode: 200,
      message: `Selamat datang, ${user.username}! Login berhasil.`,
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          profileId,
        },
        access_token: accessToken,
      },
    };
  }
}
