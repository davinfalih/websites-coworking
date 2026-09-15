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
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('spaces')
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat semua space yang tersedia (publik)' })
  @ApiResponse({ status: 200, description: 'Daftar semua space' })
  findAll() {
    return this.spacesService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Lihat space milik lokasi sendiri' })
  @ApiResponse({ status: 200, description: 'Daftar space milik sendiri' })
  findByOwner(@Request() req: any) {
    return this.spacesService.findByOwner(req.user.profileId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail space berdasarkan ID (publik)' })
  @ApiParam({ name: 'id', description: 'ID space', example: 1 })
  @ApiResponse({ status: 200, description: 'Detail space ditemukan' })
  @ApiResponse({ status: 404, description: 'Space tidak ditemukan' })
  findById(@Param('id') id: string) {
    return this.spacesService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Tambah space baru' })
  @ApiBody({ type: CreateSpaceDto })
  @ApiResponse({ status: 201, description: 'Space berhasil ditambahkan' })
  create(@Request() req: any, @Body() dto: CreateSpaceDto) {
    return this.spacesService.create(req.user.profileId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Update space berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID space', example: 1 })
  @ApiBody({ type: UpdateSpaceDto })
  @ApiResponse({ status: 200, description: 'Space berhasil diupdate' })
  update(@Param('id') id: string, @Body() dto: UpdateSpaceDto) {
    return this.spacesService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Hapus space berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID space', example: 1 })
  @ApiResponse({ status: 200, description: 'Space berhasil dihapus' })
  remove(@Param('id') id: string) {
    return this.spacesService.remove(Number(id));
  }
}
