import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReservasiItemDto {
  @ApiProperty({ example: 1, description: 'ID space yang dipesan' })
  @IsNotEmpty({ message: 'Space wajib dipilih' })
  @IsNumber()
  id_space: number;

  @ApiPropertyOptional({ example: 'DISKON10', description: 'Kode diskon/promo (opsional)' })
  @IsOptional()
  @IsString()
  kode_diskon?: string;
}

export class CreateReservasiDto {
  @ApiProperty({ example: '2026-06-15', description: 'Tanggal reservasi' })
  @IsNotEmpty({ message: 'Tanggal reservasi tidak boleh kosong' })
  tanggal_reservasi: Date | string;

  @ApiProperty({ example: '09:00', description: 'Jam mulai sewa (format HH:mm)' })
  @IsNotEmpty({ message: 'Jam mulai tidak boleh kosong' })
  @IsString()
  jam_mulai: string;

  @ApiProperty({ example: 2, description: 'Durasi sewa dalam jam' })
  @IsNotEmpty({ message: 'Durasi jam tidak boleh kosong' })
  @IsNumber()
  durasi_jam: number;

  @ApiProperty({ example: 1, description: 'ID space owner / lokasi coworking' })
  @IsNotEmpty({ message: 'ID owner tidak boleh kosong' })
  @IsNumber()
  id_owner: number;

  @ApiProperty({ type: [ReservasiItemDto], description: 'List space yang dipesan' })
  @IsArray()
  @ArrayMinSize(1, { message: 'Minimal satu space harus dipilih' })
  @ValidateNested({ each: true })
  @Type(() => ReservasiItemDto)
  items: ReservasiItemDto[];
}
