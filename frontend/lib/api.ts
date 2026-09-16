import type {
  ApiResponse,
  CreateReservasiPayload,
  DashboardSummary,
  Diskon,
  Member,
  Reservasi,
  RevenueMonthRow,
  RevenueSpaceTypeRow,
  Space,
  SpaceOwner,
  User,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server error (${res.status})`);
  }
  if (!res.ok) {
    if (res.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/sign-in';
    }
    throw new Error((data.message as string) || 'Terjadi kesalahan');
  }
  return data as T;
}

async function authFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let token: string | null = null;
  try {
    token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  } catch {
    throw new Error('Belum login');
  }
  if (!token) throw new Error('Belum login');
  return fetchApi<T>(endpoint, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options?.headers },
  });
}

function unwrap<T>(res: ApiResponse<T>): T {
  return res.data;
}

function guardUserRole(expected: string) {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem('user');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.role && parsed.role !== expected) {
        window.location.href = parsed.role === 'ADMIN_SPACE' ? '/admin/spaces' : '/customer/spaces';
      }
    } catch {
      /* abaikan */
    }
  }
}

export const api = {
  // ─── AUTH ───
  async login(username: string, password: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Username atau password salah');
    return data.data;
  },

  async registerMember(payload: {
    username: string;
    password: string;
    nama_member: string;
    instansi?: string;
    telp?: string;
  }): Promise<void> {
    const res = await fetch(`${API_URL}/auth/register/member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registrasi gagal');
  },

  // ─── MEMBERS ───
  async getMyMemberProfile(): Promise<Member> {
    return unwrap(await authFetch<ApiResponse<Member>>('/members/me'));
  },

  async updateMyMemberProfile(payload: Partial<Member>): Promise<Member> {
    return unwrap(
      await authFetch<ApiResponse<Member>>('/members/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    );
  },

  async getMembers(): Promise<Member[]> {
    return unwrap(await authFetch<ApiResponse<Member[]>>('/members'));
  },

  async deleteMember(id: number): Promise<void> {
    await authFetch<ApiResponse<unknown>>(`/members/${id}`, { method: 'DELETE' });
  },

  // ─── SPACE OWNERS ───
  async getMyOwnerProfile(): Promise<SpaceOwner> {
    return unwrap(await authFetch<ApiResponse<SpaceOwner>>('/space-owners/me'));
  },

  async updateMyOwnerProfile(payload: Partial<SpaceOwner>): Promise<SpaceOwner> {
    return unwrap(
      await authFetch<ApiResponse<SpaceOwner>>('/space-owners/me', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    );
  },

  // ─── SPACES ───
  async getSpaces(): Promise<Space[]> {
    return unwrap(await fetchApi<ApiResponse<Space[]>>('/spaces'));
  },

  async getSpaceById(id: number): Promise<Space> {
    return unwrap(await fetchApi<ApiResponse<Space>>(`/spaces/${id}`));
  },

  async getMySpaces(): Promise<Space[]> {
    guardUserRole('ADMIN_SPACE');
    return unwrap(await authFetch<ApiResponse<Space[]>>('/spaces/me'));
  },

  async createSpace(payload: {
    nama_space: string;
    harga_per_jam: number;
    tipe: 'DESK' | 'MEETING_ROOM' | 'PRIVATE_OFFICE';
    kapasitas: number;
    deskripsi?: string;
    foto?: string;
  }): Promise<Space> {
    return unwrap(
      await authFetch<ApiResponse<Space>>('/spaces', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  },

  async updateSpace(
    id: number,
    payload: {
      nama_space?: string;
      harga_per_jam?: number;
      tipe?: 'DESK' | 'MEETING_ROOM' | 'PRIVATE_OFFICE';
      kapasitas?: number;
      deskripsi?: string;
      foto?: string;
    },
  ): Promise<Space> {
    return unwrap(
      await authFetch<ApiResponse<Space>>(`/spaces/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    );
  },

  async deleteSpace(id: number): Promise<void> {
    await authFetch<ApiResponse<unknown>>(`/spaces/${id}`, { method: 'DELETE' });
  },

  // ─── DISKON ───
  async getDiskon(): Promise<Diskon[]> {
    return unwrap(await fetchApi<ApiResponse<Diskon[]>>('/diskon'));
  },

  async createDiskon(payload: {
    kode_diskon: string;
    nama_diskon?: string;
    persentase_diskon: number;
    tanggal_awal: string;
    tanggal_akhir: string;
  }): Promise<Diskon> {
    guardUserRole('ADMIN_SPACE');
    return unwrap(
      await authFetch<ApiResponse<Diskon>>('/diskon', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  },

  async updateDiskon(
    id: number,
    payload: Partial<{
      kode_diskon: string;
      nama_diskon: string;
      persentase_diskon: number;
      tanggal_awal: string;
      tanggal_akhir: string;
    }>,
  ): Promise<Diskon> {
    return unwrap(
      await authFetch<ApiResponse<Diskon>>(`/diskon/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    );
  },

  async deleteDiskon(id: number): Promise<void> {
    guardUserRole('ADMIN_SPACE');
    await authFetch<ApiResponse<unknown>>(`/diskon/${id}`, { method: 'DELETE' });
  },

  // ─── RESERVASI ───
  async createReservasi(payload: CreateReservasiPayload): Promise<Reservasi> {
    return unwrap(
      await authFetch<ApiResponse<Reservasi>>('/reservasi', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    );
  },

  async getMyReservations(params?: { month?: string; status?: string }): Promise<Reservasi[]> {
    const query = new URLSearchParams();
    if (params?.month) query.set('month', params.month);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return unwrap(
      await authFetch<ApiResponse<Reservasi[]>>(`/reservasi/member/history${qs ? `?${qs}` : ''}`),
    );
  },

  async getAllReservations(params?: { month?: string; status?: string }): Promise<Reservasi[]> {
    const query = new URLSearchParams();
    if (params?.month) query.set('month', params.month);
    if (params?.status) query.set('status', params.status);
    const qs = query.toString();
    return unwrap(await authFetch<ApiResponse<Reservasi[]>>(`/reservasi/admin${qs ? `?${qs}` : ''}`));
  },

  async getReservationDetail(id: number): Promise<Reservasi> {
    return unwrap(await authFetch<ApiResponse<Reservasi>>(`/reservasi/${id}`));
  },

  async updateReservationStatus(id: number, status: string): Promise<Reservasi> {
    return unwrap(
      await authFetch<ApiResponse<Reservasi>>(`/reservasi/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    );
  },

  async checkIn(id: number): Promise<Reservasi> {
    return unwrap(
      await authFetch<ApiResponse<Reservasi>>(`/reservasi/${id}/check-in`, { method: 'PATCH' }),
    );
  },

  async checkOut(id: number): Promise<Reservasi> {
    return unwrap(
      await authFetch<ApiResponse<Reservasi>>(`/reservasi/${id}/check-out`, { method: 'PATCH' }),
    );
  },

  async getEticket(id: number): Promise<Reservasi> {
    return unwrap(await authFetch<ApiResponse<Reservasi>>(`/reservasi/${id}/eticket`));
  },

  // ─── REPORTS ───
  async getRevenueByMonth(): Promise<RevenueMonthRow[]> {
    guardUserRole('ADMIN_SPACE');
    return unwrap(await authFetch<ApiResponse<RevenueMonthRow[]>>('/reports/revenue/month'));
  },

  async getRevenueBySpaceType(): Promise<RevenueSpaceTypeRow[]> {
    guardUserRole('ADMIN_SPACE');
    return unwrap(await authFetch<ApiResponse<RevenueSpaceTypeRow[]>>('/reports/revenue/space-type'));
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    guardUserRole('ADMIN_SPACE');
    return unwrap(await authFetch<ApiResponse<DashboardSummary>>('/reports/dashboard'));
  },

  // ─── UPLOAD ───
  async uploadFile(file: File): Promise<{ url: string }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_URL}/uploads`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengunggah file');
    return data.data;
  },
};

export function createClient() {
  return api;
}

export const SPACE_TYPE_LABEL: Record<string, string> = {
  DESK: 'Personal Desk',
  MEETING_ROOM: 'Meeting Room',
  PRIVATE_OFFICE: 'Private Office',
};

export const RESERVASI_STATUS_LABEL: Record<string, string> = {
  BELUM_DIKONFIRM: 'Belum Dikonfirmasi',
  DISETUJUI: 'Disetujui',
  AKTIF: 'Aktif',
  SELESAI: 'Selesai',
  DIBATALKAN: 'Dibatalkan',
};

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);

export const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });