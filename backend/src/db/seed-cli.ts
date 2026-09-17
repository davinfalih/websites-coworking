// backend/src/db/seed-cli.ts
// Runner mandiri agar seed dapat dijalankan manual dari Console service:
//   node dist/db/seed-cli.js
import 'dotenv/config';
import { PrismaService } from '../prisma/prisma.service';
import { seedDatabase } from './seed';

(async () => {
  const prisma = new PrismaService();
  try {
    await prisma.$connect();
    console.log('[seed-cli] Terhubung ke database.');
    await seedDatabase(prisma);
  } catch (err) {
    console.error('[seed-cli] Gagal:', (err as Error).message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();