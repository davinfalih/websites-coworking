import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReservasiStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({
    enum: ReservasiStatus,
    description: 'Status baru reservasi',
    example: ReservasiStatus.DISETUJUI,
  })
  @IsNotEmpty({ message: 'Status tidak boleh kosong' })
  @IsEnum(ReservasiStatus, { message: 'Status tidak valid' })
  status: ReservasiStatus;
}
