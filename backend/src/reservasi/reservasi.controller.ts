import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { ReservasiService } from './reservasi.service';
import { CreateReservasiDto } from './dto/create-reservasi.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('reservasi')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservasi')
export class ReservasiController {
  constructor(private readonly reservasiService: ReservasiService) {}

  // Histori reservasi milik member
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MEMBER')
  @Get('member/history')
  @ApiOperation({ summary: '[MEMBER] Lihat histori reservasi milik sendiri (filter bulan)' })
  @ApiQuery({ name: 'month', required: false, example: '2026-06', description: 'Filter bulan (YYYY-MM)' })
  @ApiResponse({ status: 200, description: 'Histori reservasi berhasil diambil' })
  myHistory(@Request() req: any, @Query('month') month?: string) {
    return this.reservasiService.findAll({ memberId: req.user.profileId, month });
  }

  // Semua reservasi untuk admin space (filter status & bulan)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Get('admin')
  @ApiOperation({ summary: '[ADMIN SPACE] Lihat semua reservasi (filter status & bulan)' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter status' })
  @ApiQuery({ name: 'month', required: false, example: '2026-06', description: 'Filter bulan (YYYY-MM)' })
  @ApiResponse({ status: 200, description: 'Semua reservasi berhasil diambil' })
  adminAll(@Query('status') status: any, @Query('month') month?: string) {
    return this.reservasiService.findAll({ status, month });
  }

  @Get(':id/eticket')
  @ApiOperation({ summary: 'Cetak e-ticket / bukti reservasi dengan QR code' })
  @ApiParam({ name: 'id', description: 'ID reservasi', example: 1 })
  @ApiResponse({ status: 200, description: 'E-ticket berhasil dibuat (termasuk QR code)' })
  eticket(@Param('id') id: string) {
    return this.reservasiService.generateEticket(Number(id));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail reservasi berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID reservasi', example: 1 })
  @ApiResponse({ status: 200, description: 'Detail reservasi ditemukan' })
  detail(@Param('id') id: string) {
    return this.reservasiService.getDetail(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MEMBER')
  @Post()
  @ApiOperation({ summary: '[MEMBER] Buat reservasi / pemesanan space' })
  @ApiBody({ type: CreateReservasiDto })
  @ApiResponse({ status: 201, description: 'Reservasi berhasil dibuat' })
  create(@Request() req: any, @Body() dto: CreateReservasiDto) {
    return this.reservasiService.create(req.user.profileId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE', 'MEMBER')
  @Patch(':id/status')
  @ApiOperation({ summary: '[ADMIN SPACE] Konfirmasi/ubah status | [MEMBER] Batalkan' })
  @ApiParam({ name: 'id', description: 'ID reservasi', example: 1 })
  @ApiBody({ type: UpdateStatusDto })
  @ApiResponse({ status: 200, description: 'Status reservasi diperbarui' })
  updateStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
  ) {
    return this.reservasiService.updateStatus(Number(id), dto, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Patch(':id/check-in')
  @ApiOperation({ summary: '[ADMIN SPACE] Proses check-in tamu di lokasi' })
  @ApiParam({ name: 'id', description: 'ID reservasi', example: 1 })
  checkIn(@Param('id') id: string) {
    return this.reservasiService.checkIn(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Patch(':id/check-out')
  @ApiOperation({ summary: '[ADMIN SPACE] Proses check-out tamu di lokasi' })
  @ApiParam({ name: 'id', description: 'ID reservasi', example: 1 })
  checkOut(@Param('id') id: string) {
    return this.reservasiService.checkOut(Number(id));
  }
}
