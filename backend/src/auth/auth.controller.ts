import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterMemberDto } from './dto/register-member.dto';
import { RegisterOwnerDto } from './dto/register-owner.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/member')
  @ApiOperation({ summary: 'Registrasi akun member/pengunjung' })
  @ApiBody({ type: RegisterMemberDto })
  @ApiResponse({ status: 201, description: 'Member berhasil didaftarkan' })
  @ApiResponse({ status: 400, description: 'Data tidak valid / username sudah dipakai' })
  registerMember(@Body() dto: RegisterMemberDto) {
    return this.authService.registerMember(dto);
  }

  @Post('register/owner')
  @ApiOperation({ summary: 'Registrasi pengelola space (admin space)' })
  @ApiBody({ type: RegisterOwnerDto })
  @ApiResponse({ status: 201, description: 'Pengelola space berhasil didaftarkan' })
  @ApiResponse({ status: 400, description: 'Data tidak valid / username sudah dipakai' })
  registerOwner(@Body() dto: RegisterOwnerDto) {
    return this.authService.registerOwner(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login dan dapatkan JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login berhasil, token dikembalikan' })
  @ApiResponse({ status: 401, description: 'Username atau password salah' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
