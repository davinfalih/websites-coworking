// backend/src/db/seed.ts
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { Role, SpaceType } from '@prisma/client';

const DEMO_PASSWORD = 'password123';

const SEED_SPACES: {
  nama_space: string;
  harga_per_jam: number;
  tipe: SpaceType;
  kapasitas: number;
  deskripsi: string;
}[] = [
  { nama_space: 'Personal Desk 01', harga_per_jam: 15000, tipe: SpaceType.DESK, kapasitas: 1, deskripsi: 'Meja kerja pribadi dekat jendela' },
  { nama_space: 'Meeting Room A', harga_per_jam: 100000, tipe: SpaceType.MEETING_ROOM, kapasitas: 10, deskripsi: 'Ruang rapat dengan proyektor dan papan tulis' },
  { nama_space: 'Private Office 1', harga_per_jam: 50000, tipe: SpaceType.PRIVATE_OFFICE, kapasitas: 5, deskripsi: 'Kantor pribadi untuk tim kecil' },
  { nama_space: 'Personal Desk 02', harga_per_jam: 15000, tipe: SpaceType.DESK, kapasitas: 1, deskripsi: 'Meja kerja pribadi dekat jendela dengan pencahayaan alami dan akses stopkontak.' },
  { nama_space: 'Personal Desk 03', harga_per_jam: 15000, tipe: SpaceType.DESK, kapasitas: 1, deskripsi: 'Workstation focus dengan partisi privasi, ideal untuk deep work harian.' },
  { nama_space: 'Focus Pod Premium', harga_per_jam: 25000, tipe: SpaceType.DESK, kapasitas: 1, deskripsi: 'Pod kedap suara one-person dengan kursi ergonomis, sempurna untuk meeting online.' },
  { nama_space: 'Personal Desk 04', harga_per_jam: 18000, tipe: SpaceType.DESK, kapasitas: 2, deskripsi: 'Meja kerja untuk dua orang dengan pembatas fleksibel dan kursi tugas.' },
  { nama_space: 'Virtual Office Desk', harga_per_jam: 20000, tipe: SpaceType.DESK, kapasitas: 2, deskripsi: 'Workstation untuk tim kecil dengan alamat bisnis terdaftar.' },
  { nama_space: 'Meeting Room B', harga_per_jam: 85000, tipe: SpaceType.MEETING_ROOM, kapasitas: 8, deskripsi: 'Ruang meeting kapasitas 8 dengan TV 65 inci, whiteboard, dan video conference.' },
  { nama_space: 'Meeting Room C', harga_per_jam: 70000, tipe: SpaceType.MEETING_ROOM, kapasitas: 6, deskripsi: 'Ruang rapat intim kapasitas 6 dengan proyektor dan pantry kopi.' },
  { nama_space: 'Private Office 2', harga_per_jam: 60000, tipe: SpaceType.PRIVATE_OFFICE, kapasitas: 4, deskripsi: 'Kantor privat untuk tim 4 orang, terkunci dengan akses 24 jam.' },
  { nama_space: 'Personal Desk 05', harga_per_jam: 15000, tipe: SpaceType.DESK, kapasitas: 1, deskripsi: 'Workstation tenang dekat area hijau dengan stopkontak dan lampu meja.' },
  { nama_space: 'Personal Desk 06', harga_per_jam: 15000, tipe: SpaceType.DESK, kapasitas: 1, deskripsi: 'Meja pribadi dengan partisi tinggi dan kursi ergonomis premium.' },
  { nama_space: 'Personal Desk 07', harga_per_jam: 16000, tipe: SpaceType.DESK, kapasitas: 1, deskripsi: 'Desk focus dengan pencahayaan costumable dan akses kopi gratis.' },
  { nama_space: 'Focus Pod Solo', harga_per_jam: 30000, tipe: SpaceType.DESK, kapasitas: 1, deskripsi: 'Pod one-person kedap suara dengan white noise control untuk deep focus.' },
  { nama_space: 'Focus Pod Duo', harga_per_jam: 45000, tipe: SpaceType.DESK, kapasitas: 2, deskripsi: 'Pod berdua untuk kerja kolaboratif dengan layar monitor bersama.' },
  { nama_space: 'Hot Desk Flex', harga_per_jam: 18000, tipe: SpaceType.DESK, kapasitas: 1, deskripsi: 'Hot desk fleksibel bergaya santai, cocok untuk pekerja bebas.' },
  { nama_space: 'Meeting Room D', harga_per_jam: 65000, tipe: SpaceType.MEETING_ROOM, kapasitas: 5, deskripsi: 'Ruang rapat kompak untuk 5 orang dengan sistem video call.' },
  { nama_space: 'Meeting Room E', harga_per_jam: 95000, tipe: SpaceType.MEETING_ROOM, kapasitas: 10, deskripsi: 'Meeting room besar dengan proyektor 4K dan sound system.' },
  { nama_space: 'Meeting Room F', harga_per_jam: 75000, tipe: SpaceType.MEETING_ROOM, kapasitas: 7, deskripsi: 'Ruang meeting terang dengan dinding kaca dan pantry mandiri.' },
  { nama_space: 'Private Office 3', harga_per_jam: 55000, tipe: SpaceType.PRIVATE_OFFICE, kapasitas: 3, deskripsi: 'Kantor privat 3 orang dengan pintu kunci dan meja besar.' },
  { nama_space: 'Private Suite 4', harga_per_jam: 80000, tipe: SpaceType.PRIVATE_OFFICE, kapasitas: 6, deskripsi: 'Suite privat 6 orang dengan area lounge dan view kota.' },
];

export async function seedDatabase(prisma: PrismaService) {
  try {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    // Owner / Admin Space
    let ownerUser = await prisma.user.findUnique({ where: { username: 'owner1' } });
    if (!ownerUser) {
      ownerUser = await prisma.user.create({
        data: { username: 'owner1', password: passwordHash, role: Role.ADMIN_SPACE },
      });
    }
    let owner = await prisma.spaceOwner.findFirst({ where: { id_user: ownerUser.id } });
    if (!owner) {
      owner = await prisma.spaceOwner.create({
        data: {
          id_user: ownerUser.id,
          nama_coworking: 'Coworking Nusantara',
          nama_pemilik: 'Siti Rahayu',
          telp: '081234567890',
        },
      });
    }

    // Member
    let memberUser = await prisma.user.findUnique({ where: { username: 'member1' } });
    if (!memberUser) {
      memberUser = await prisma.user.create({
        data: { username: 'member1', password: passwordHash, role: Role.MEMBER },
      });
    }
    let member = await prisma.member.findFirst({ where: { id_user: memberUser.id } });
    if (!member) {
      member = await prisma.member.create({
        data: {
          id_user: memberUser.id,
          nama_member: 'Davin Santoso',
          instansi: 'PT Maju Jaya Tbk',
          telp: '081298765432',
        },
      });
    }

    // Diskon
    const diskon = await prisma.diskon.findUnique({ where: { kode_diskon: 'DISKON10' } });
    if (!diskon) {
      await prisma.diskon.create({
        data: {
          kode_diskon: 'DISKON10',
          nama_diskon: 'Diskon Member 10%',
          persentase_diskon: 10,
          tanggal_awal: new Date('2026-01-01'),
          tanggal_akhir: new Date('2026-12-31'),
        },
      });
    }

    // Spaces (hanya yang belum ada)
    const existing = await prisma.space.findMany({ select: { nama_space: true } });
    const existingNames = new Set(existing.map((s) => s.nama_space));
    let added = 0;
    for (const s of SEED_SPACES) {
      if (existingNames.has(s.nama_space)) continue;
      await prisma.space.create({
        data: {
          nama_space: s.nama_space,
          harga_per_jam: s.harga_per_jam,
          tipe: s.tipe,
          kapasitas: s.kapasitas,
          deskripsi: s.deskripsi,
          id_owner: owner.id,
        },
      });
      added++;
    }

    const total = await prisma.space.count();
    console.log(
      `[seed] Selesai. Space ditambahkan: ${added}, total space: ${total}. Owner: ${owner.nama_coworking}, Member: ${member.nama_member}, Diskon: DISKON10.`,
    );
  } catch (err) {
    console.error('[seed] Gagal menjalankan seed:', (err as Error).message);
  }
}