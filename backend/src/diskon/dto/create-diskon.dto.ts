import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDiskonDto {
  @ApiProperty({ example: 'DISKON10', description: 'Kode potongan harga/promo' })
  @IsNotEmpty({ message: 'Kode diskon tidak boleh kosong' })
  @IsString()
  kode_diskon: string;

  @ApiProperty({ example: 'Promo Grand Opening', description: 'Nama diskon' })
  @IsNotEmpty({ message: 'Nama diskon tidak boleh kosong' })
  @IsString()
  nama_diskon: string;

  @ApiProperty({ example: 10, description: 'Persentase diskon (0-100)' })
  @IsNotEmpty({ message: 'Persentase diskon tidak boleh kosong' })
  @IsNumber()
  @Min(0)
  @Max(100)
  persentase_diskon: number;

  @ApiProperty({ example: '2026-06-01T00:00:00.000Z', description: 'Tanggal mulai berlaku' })
  @IsNotEmpty({ message: 'Tanggal awal tidak boleh kosong' })
  tanggal_awal: Date | string;

  @ApiProperty({ example: '2026-06-30T23:59:59.000Z', description: 'Tanggal selesai berlaku' })
  @IsNotEmpty({ message: 'Tanggal akhir tidak boleh kosong' })
  tanggal_akhir: Date | string;
}
