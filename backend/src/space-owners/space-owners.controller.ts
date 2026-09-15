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
import { SpaceOwnersService } from './space-owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('space-owners')
@Controller('space-owners')
export class SpaceOwnersController {
  constructor(private readonly ownersService: SpaceOwnersService) {}

  // Profil owner yang sedang login
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN_SPACE')
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Lihat profil lokasi coworking yang sedang login' })
  @ApiResponse({ status: 200, description: 'Data profil berhasil diambil' })
  getProfile(@Request() req: any) {
    return this.ownersService.getProfile(req.user.profileId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN_SPACE')
  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Update profil lokasi coworking / pengelola' })
  @ApiBody({ type: UpdateOwnerDto })
  @ApiResponse({ status: 200, description: 'Profil berhasil diupdate' })
  updateProfile(@Request() req: any, @Body() dto: UpdateOwnerDto) {
    return this.ownersService.updateProfile(req.user.profileId, dto);
  }

  // Admin CRUD
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Lihat semua pengelola space' })
  findAll() {
    return this.ownersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Lihat pengelola space berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID space owner', example: 1 })
  findById(@Param('id') id: string) {
    return this.ownersService.findById(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Tambah pengelola space baru' })
  @ApiBody({ type: CreateOwnerDto })
  create(@Body() dto: CreateOwnerDto) {
    return this.ownersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Update pengelola space berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID space owner', example: 1 })
  @ApiBody({ type: UpdateOwnerDto })
  update(@Param('id') id: string, @Body() dto: UpdateOwnerDto) {
    return this.ownersService.update(Number(id), dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN_SPACE')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: '[ADMIN SPACE] Hapus pengelola space berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID space owner', example: 1 })
  remove(@Param('id') id: string) {
    return this.ownersService.remove(Number(id));
  }
}
