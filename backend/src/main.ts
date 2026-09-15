import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Coworking Space API')
    .setDescription('Dokumentasi API Aplikasi Reservasi Coworking Space (UKL)')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('members')
    .addTag('space-owners')
    .addTag('spaces')
    .addTag('diskon')
    .addTag('reservasi')
    .addTag('reports')
    .addTag('uploads')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();

  // Serve uploaded files statically
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`Server berjalan di port ${process.env.PORT || 3000}`);
}
bootstrap();
