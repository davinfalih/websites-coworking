import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // Profil member yang sedang login
  @UseGuards(JwtAuthGuard)
  @Roles('MEMBER')
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[MEMBER] Lihat profil member yang sedang login' })
  @ApiResponse({ status: 200, description: 'Data profil berhasil diambil' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi' })
  getProfile(@Request() req: any) {
    return this.membersService.getProfile(req.user.profileId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('MEMBER')
  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[MEMBER] Update profil member yang sedang login' })
  @ApiBody({ type: UpdateMemberDto })
  @ApiResponse({ status: 200, description: 'Profil berhasil diupdate' })
  updateProfile(@Request() req: any, @Body() dto: UpdateMemberDto) {
    return this.membersService.updateProfile(req.user.profileId, dto);
  }

  // Admin CRUD
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Lihat semua member' })
  @ApiResponse({ status: 200, description: 'Daftar semua member' })
  @ApiResponse({ status: 403, description: 'Akses ditolak - bukan admin space' })
  findAll() {
    return this.membersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Lihat member berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID member', example: 1 })
  @ApiResponse({ status: 200, description: 'Data member ditemukan' })
  @ApiResponse({ status: 404, description: 'Member tidak ditemukan' })
  findById(@Param('id') id: string) {
    return this.membersService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Tambah member baru' })
  @ApiBody({ type: CreateMemberDto })
  @ApiResponse({ status: 201, description: 'Member berhasil ditambahkan' })
  @ApiResponse({ status: 400, description: 'Data tidak valid / username sudah dipakai' })
  create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Update member berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID member', example: 1 })
  @ApiBody({ type: UpdateMemberDto })
  @ApiResponse({ status: 200, description: 'Member berhasil diupdate' })
  update(@Param('id') id: string, @Body() dto: UpdateMemberDto) {
    return this.membersService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Hapus member berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID member', example: 1 })
  @ApiResponse({ status: 200, description: 'Member berhasil dihapus' })
  @ApiResponse({ status: 404, description: 'Member tidak ditemukan' })
  remove(@Param('id') id: string) {
    return this.membersService.remove(Number(id));
  }
}
