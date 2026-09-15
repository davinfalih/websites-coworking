import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SpaceType } from '@prisma/client';

export class UpdateSpaceDto {
  @ApiPropertyOptional({ example: 'Personal Desk 01', description: 'Nama space' })
  @IsOptional()
  @IsString()
  nama_space?: string;

  @ApiPropertyOptional({ example: 15000, description: 'Harga sewa per jam' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  harga_per_jam?: number;

  @ApiPropertyOptional({ enum: SpaceType, description: 'Tipe space' })
  @IsOptional()
  @IsEnum(SpaceType)
  tipe?: SpaceType;

  @ApiPropertyOptional({ example: 1, description: 'Kapasitas (jumlah orang)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  kapasitas?: number;

  @ApiPropertyOptional({ example: 'Meja kerja dengan kursi ergonomis & stop kontak', description: 'Deskripsi fasilitas' })
  @IsOptional()
  @IsString()
  deskripsi?: string;

  @ApiPropertyOptional({ example: '/uploads/space.jpg', description: 'URL foto space' })
  @IsOptional()
  @IsString()
  foto?: string;
}
