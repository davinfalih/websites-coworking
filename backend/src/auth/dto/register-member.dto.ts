import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterMemberDto {
  @ApiProperty({ example: 'member123', description: 'Username unik' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap member' })
  @IsNotEmpty({ message: 'Nama member tidak boleh kosong' })
  @IsString()
  nama_member: string;

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
}
