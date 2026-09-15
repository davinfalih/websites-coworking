import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { DiskonService } from './diskon.service';
import { CreateDiskonDto } from './dto/create-diskon.dto';
import { UpdateDiskonDto } from './dto/update-diskon.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('diskon')
@Controller('diskon')
export class DiskonController {
  constructor(private readonly diskonService: DiskonService) {}

  @Get()
  @ApiOperation({ summary: 'Lihat semua kode diskon (publik)' })
  @ApiResponse({ status: 200, description: 'Daftar semua diskon' })
  findAll() {
    return this.diskonService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lihat detail diskon berdasarkan ID (publik)' })
  @ApiParam({ name: 'id', description: 'ID diskon', example: 1 })
  findById(@Param('id') id: string) {
    return this.diskonService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Tambah kode diskon/promo baru' })
  @ApiBody({ type: CreateDiskonDto })
  @ApiResponse({ status: 201, description: 'Diskon berhasil dibuat' })
  @ApiResponse({ status: 400, description: 'Kode diskon sudah terdaftar' })
  create(@Body() dto: CreateDiskonDto) {
    return this.diskonService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Update kode diskon berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID diskon', example: 1 })
  @ApiBody({ type: UpdateDiskonDto })
  update(@Param('id') id: string, @Body() dto: UpdateDiskonDto) {
    return this.diskonService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Hapus kode diskon berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID diskon', example: 1 })
  remove(@Param('id') id: string) {
    return this.diskonService.remove(Number(id));
  }
}
