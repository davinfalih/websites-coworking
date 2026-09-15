import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMemberDto {
  @ApiPropertyOptional({ example: 'Budi Santoso', description: 'Nama lengkap member' })
  @IsOptional()
  @IsString()
  nama_member?: string;

  @ApiPropertyOptional({ example: 'PT Maju Jaya', description: 'Instansi/perusahaan' })
  @IsOptional()
  @IsString()
  instansi?: string;

  @ApiPropertyOptional({ example: 'Jl. Merdeka No.1, Jakarta', description: 'Alamat' })
  @IsOptional()
  @IsString()
  alamat?: string;

  @ApiPropertyOptional({ example: '081234567890', description: 'No. telepon' })
  @IsOptional()
  @IsString()
  telp?: string;

  @ApiPropertyOptional({ example: '/uploads/foto.jpg', description: 'URL foto profil' })
  @IsOptional()
  @IsString()
  foto?: string;

  @ApiPropertyOptional({ example: 'member123', description: 'Username baru' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'password123', description: 'Password baru (minimal 6 karakter)' })
  @IsOptional()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password?: string;
}
