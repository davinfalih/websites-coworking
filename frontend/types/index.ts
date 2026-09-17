export type Role = 'ADMIN_SPACE' | 'MEMBER';

export interface User {
  id: number;
  username: string;
  role: Role;
  profileId?: number | null;
}

export interface SpaceOwner {
  id: number;
  id_user?: number | null;
  nama_coworking: string;
  nama_pemilik: string;
  telp?: string | null;
  alamat?: string | null;
  user?: { username?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Member {
  id: number;
  id_user?: number | null;
  nama_member: string;
  instansi?: string | null;
  alamat?: string | null;
  telp?: string | null;
  foto?: string | null;
  user?: { username?: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export type SpaceType = 'DESK' | 'MEETING_ROOM' | 'PRIVATE_OFFICE';

export interface Space {
  id: number;
  nama_space: string;
  harga_per_jam: number;
  tipe: SpaceType;
  kapasitas: number;
  deskripsi?: string | null;
  foto?: string | null;
  id_owner: number;
  owner?: SpaceOwner;
  diskon?: Diskon | null;
}

export interface Diskon {
  id: number;
  kode_diskon: string;
  nama_diskon?: string | null;
  persentase_diskon: number;
  tanggal_awal: string;
  tanggal_akhir: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ReservasiStatus =
  | 'BELUM_DIKONFIRM'
  | 'DISETUJUI'
  | 'AKTIF'
  | 'SELESAI'
  | 'DIBATALKAN';

export interface DetailReservasi {
  id: number;
  total_harga: number;
  id_reservasi: number;
  id_space: number;
  id_diskon?: number | null;
  space?: Space;
  diskon?: Diskon | null;
}

export interface Reservasi {
  id: number;
  tanggal_reservasi: string;
  jam_mulai: string;
  durasi_jam: number;
  status: ReservasiStatus;
  kode_reservasi: string;
  check_in_at?: string | null;
  check_out_at?: string | null;
  id_owner: number;
  id_member: number;
  member?: { id: number; nama_member: string; telp?: string | null };
  owner?: { id: number; nama_coworking: string; nama_pemilik?: string };
  details?: DetailReservasi[];
  qr_code?: string;
}

export interface ReservasiPayloadItem {
  id_space: number;
  kode_diskon?: string;
}

export interface CreateReservasiPayload {
  tanggal_reservasi: string;
  jam_mulai: string;
  durasi_jam: number;
  id_owner: number;
  items: ReservasiPayloadItem[];
}

export interface RevenueMonthRow {
  bulan: string;
  jumlah_reservasi: number;
  pendapatan: number;
}

export interface RevenueSpaceTypeRow {
  tipe: SpaceType;
  label: string;
  jumlah: number;
  pendapatan: number;
}

export interface DashboardSummary {
  total_reservasi: number;
  status: Record<string, number>;
  total_pendapatan: number;
  pendapatan_per_bulan: RevenueMonthRow[];
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data: T;
}

export interface StatData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeType?: 'increase' | 'decrease';
}