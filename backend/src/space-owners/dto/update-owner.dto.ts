import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOwnerDto {
  @ApiPropertyOptional({ example: 'Coworking Nusantara', description: 'Nama lokasi coworking space' })
  @IsOptional()
  @IsString()
  nama_coworking?: string;

  @ApiPropertyOptional({ example: 'Siti Rahayu', description: 'Nama pemilik/pengelola' })
  @IsOptional()
  @IsString()
  nama_pemilik?: string;

  @ApiPropertyOptional({ example: '081234567890', description: 'No. telepon' })
  @IsOptional()
  @IsString()
  telp?: string;

  @ApiPropertyOptional({ example: 'adminspace1', description: 'Username baru' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'password123', description: 'Password baru (minimal 6 karakter)' })
  @IsOptional()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password?: string;
}
