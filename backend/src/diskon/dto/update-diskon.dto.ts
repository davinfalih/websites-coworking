import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDiskonDto {
  @ApiPropertyOptional({ example: 'DISKON10', description: 'Kode potongan harga/promo' })
  @IsOptional()
  @IsString()
  kode_diskon?: string;

  @ApiPropertyOptional({ example: 'Promo Grand Opening', description: 'Nama diskon' })
  @IsOptional()
  @IsString()
  nama_diskon?: string;

  @ApiPropertyOptional({ example: 10, description: 'Persentase diskon (0-100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  persentase_diskon?: number;

  @ApiPropertyOptional({ example: '2026-06-01T00:00:00.000Z', description: 'Tanggal mulai berlaku' })
  @IsOptional()
  tanggal_awal?: Date | string;

  @ApiPropertyOptional({ example: '2026-06-30T23:59:59.000Z', description: 'Tanggal selesai berlaku' })
  @IsOptional()
  tanggal_akhir?: Date | string;
}
