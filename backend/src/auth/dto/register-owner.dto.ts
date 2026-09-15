import { IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterOwnerDto {
  @ApiProperty({ example: 'adminspace1', description: 'Username unik' })
  @IsNotEmpty({ message: 'Username tidak boleh kosong' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password minimal 6 karakter' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  @ApiProperty({ example: 'Coworking Nusantara', description: 'Nama lokasi coworking space' })
  @IsNotEmpty({ message: 'Nama coworking tidak boleh kosong' })
  @IsString()
  nama_coworking: string;

  @ApiProperty({ example: 'Siti Rahayu', description: 'Nama pemilik/pengelola' })
  @IsNotEmpty({ message: 'Nama pemilik tidak boleh kosong' })
  @IsString()
  nama_pemilik: string;

  @ApiPropertyOptional({ example: '081234567890', description: 'No. telepon' })
  @IsOptional()
  @IsString()
  telp?: string;
}
