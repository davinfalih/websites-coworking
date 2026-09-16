import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/jwt.guard';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

@ApiTags('uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  @Post()
  @ApiOperation({ summary: 'Upload gambar (foto profil / foto space)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({ status: 201, description: 'File berhasil diunggah' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          mkdirSync(UPLOAD_DIR, { recursive: true });
          cb(null, UPLOAD_DIR);
        },
        filename: (_req, file, cb) => {
          const name = `${Date.now()}-${randomUUID()}${extname(
            file.originalname,
          )}`;
          cb(null, name);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        const ok = allowed.test(extname(file.originalname).toLowerCase());
        if (ok) cb(null, true);
        else cb(new BadRequestException('File harus berupa gambar'), false);
      },
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan');
    }
    return {
      statusCode: 201,
      success: true,
      message: 'File berhasil diunggah',
      data: {
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        originalname: file.originalname,
        size: file.size,
      },
    };
  }
}
