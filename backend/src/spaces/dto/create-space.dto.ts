import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SpaceType } from '@prisma/client';

export class CreateSpaceDto {
  @ApiProperty({ example: 'Personal Desk 01', description: 'Nama space' })
  @IsNotEmpty({ message: 'Nama space tidak boleh kosong' })
  @IsString()
  nama_space: string;

  @ApiProperty({ example: 15000, description: 'Harga sewa per jam' })
  @IsNotEmpty({ message: 'Harga per jam tidak boleh kosong' })
  @IsNumber()
  @Min(0)
  harga_per_jam: number;

  @ApiProperty({ enum: SpaceType, description: 'Tipe space' })
  @IsNotEmpty({ message: 'Tipe space tidak boleh kosong' })
  @IsEnum(SpaceType)
  tipe: SpaceType;

  @ApiProperty({ example: 1, description: 'Kapasitas (jumlah orang)' })
  @IsNotEmpty({ message: 'Kapasitas tidak boleh kosong' })
  @IsNumber()
  @Min(1)
  kapasitas: number;

  @ApiPropertyOptional({ example: 'Meja kerja dengan kursi ergonomis & stop kontak', description: 'Deskripsi fasilitas' })
  @IsOptional()
  @IsString()
  deskripsi?: string;

  @ApiPropertyOptional({ example: '/uploads/space.jpg', description: 'URL foto space' })
  @IsOptional()
  @IsString()
  foto?: string;
}
