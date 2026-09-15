# Smart Space Booking API

Backend NestJS untuk aplikasi **Coworking Space Reservation** (UKL Paket B) — "Smart Space Booking".
Sistem reservasi ruang kerja (desk, meeting room, private office) dengan manajemen diskon, reservasi, e-ticket QR, dan laporan pendapatan.

Struktur proyek mengikuti konvensi referensi `TenunKita-backend`, dengan isi sesuai kebutuhan UKL.

## Tech Stack

- **NestJS 12** (TypeScript)
- **Prisma ORM 6** — schema & koneksi database
- **MySQL / MariaDB** (XAMPP) — database `coworking_space`
- **JWT** — autentikasi (guard global `JwtAuthGuard` + `RolesGuard`)
- **bcrypt** — hashing password
- **qr-code** — e-ticket reservasi
- **multer** — upload file lokal ke folder `uploads/`
- **Swagger** — dokumentasi API di `/api`

## Struktur Modul

```
src/
├── main.ts                    # Bootstrap: Swagger /api, ValidationPipe, CORS, static /uploads
├── app.module.ts              # Modul root
├── prisma/                    # PrismaService (global) + PrismaModule
├── auth/                      # Register member/owner, login; JwtAuthGuard, RolesGuard, @Roles
├── members/                   # Profil member (me) + CRUD admin
├── space-owners/              # Profil pengelola (me) + CRUD admin
├── spaces/                    # Kelola space (public list, owner CRUD)
├── diskon/                    # Kelola kode diskon / promo
├── reservasi/                 # Buat reservasi (cek konflik, diskon), update status, check-in/out, e-ticket QR
├── reports/                   # Laporan pendapatan per bulan & jenis space, dashboard
└── uploads/                   # Upload file (multer disk storage)
```

## Database (ERD)

Tabel (Prisma): `User`, `Member`, `SpaceOwner`, `Space`, `Diskon`, `Reservasi`, `DetailReservasi`

- **Enums:** `Role` (`ADMIN_SPACE` / `MEMBER`), `SpaceType` (`DESK` / `MEETING_ROOM` / `PRIVATE_OFFICE`), `ReservasiStatus` (`BELUM_DIKONFIRM` / `DISETUJUI` / `AKTIF` / `SELESAI` / `DIBATALKAN`).

## Persyaratan

- Node.js >= 20
- XAMPP (MySQL/MariaDB) berjalan di `localhost:3306`

## Setup

1. Install dependensi:

```bash
npm install
```

2. Buat file `.env` dari contoh:

```bash
cp .env.example .env
```

Sesuaikan `DATABASE_URL` jika perlu (default: `mysql://root:@localhost:3306/coworking_space`).

3. Buat database:

```bash
mysql -u root -e "CREATE DATABASE coworking_space;"
```

4. Sinkronkan schema Prisma ke database:

```bash
npx prisma db push
```

5. Jalankan server:

```bash
npm run start:dev
```

Server berjalan di `http://localhost:3000`.
Dokumentasi Swagger tersedia di `http://localhost:3000/api`.

## Endpoint Utama

| Model       | Metode | Endpoint                                   | Role       | Keterangan                          |
|-------------|--------|--------------------------------------------|------------|-------------------------------------|
| Auth        | POST   | `/auth/register/member`                    | Public     | Registrasi member                   |
| Auth        | POST   | `/auth/register/owner`                     | Public     | Registrasi pengelola space          |
| Auth        | POST   | `/auth/login`                              | Public     | Login, dapat token                  |
| Members     | GET/PATCH | `/members/me`                            | MEMBER     | Profil member                       |
| SpaceOwners | GET/PATCH | `/space-owners/me`                      | ADMIN_SPACE| Profil pengelola                    |
| Spaces      | GET    | `/spaces`                                  | Public     | List space                          |
| Spaces      | POST   | `/spaces`                                  | ADMIN_SPACE| Tambah space                        |
| Diskon      | POST   | `/diskon`                                  | ADMIN_SPACE| Tambah kode diskon                  |
| Reservasi   | POST   | `/reservasi`                               | MEMBER     | Buat reservasi (pending)            |
| Reservasi   | GET    | `/reservasi/member/history`                | MEMBER     | Riwayat member (filter month)       |
| Reservasi   | PATCH  | `/reservasi/:id/status`                    | Both       | Update status (approve/batal)       |
| Reservasi   | PATCH  | `/reservasi/:id/check-in` / `check-out`    | ADMIN_SPACE| Check-in/out                        |
| Reservasi   | GET    | `/reservasi/:id/eticket`                   | MEMBER     | E-ticket dengan QR                  |
| Reports     | GET    | `/reports/revenue/month`                   | ADMIN_SPACE| Pendapatan per bulan                |
| Reports     | GET    | `/reports/revenue/space-type`              | ADMIN_SPACE| Pendapatan per jenis space          |
| Reports     | GET    | `/reports/dashboard`                       | ADMIN_SPACE| Ringkasan dashboard                 |
| Uploads     | POST   | `/uploads`                                 | Auth       | Upload file gambar                  |

## Alur Reservasi

`BELUM_DIKONFIRM` → (admin approve) → `DISETUJUI` → (check-in) → `AKTIF` → (check-out) → `SELESAI`

- Reservasi dibatalkan hanya oleh member pemilik yang memesan (saat status belum dikonfirmasi).
- Ada validasi bentrok waktu (`assertNoConflict`) agar satu space tidak di-reservasi ganda pada jam yang sama.
- Kode diskon (`kode_diskon`) dipakai saat membuat reservasi dan mengurangi total harga (`total_harga`), tersimpan di `DetailReservasi`.

## Script

```bash
npm run build        # kompilasi ke dist/
npm run start:dev    # development (watch)
npm run start:prod   # produksi (node dist/main)
npm run lint         # lint
```
