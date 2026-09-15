'use client';

import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import type { Reservasi } from '@/types';
import { RESERVASI_STATUS_LABEL } from '@/lib/api';

interface RecentReservationsProps {
  reservations: Reservasi[];
}

const statusColors: Record<string, string> = {
  BELUM_DIKONFIRM: 'bg-yellow-100 text-yellow-800',
  DISETUJUI: 'bg-blue-100 text-blue-800',
  AKTIF: 'bg-purple-100 text-purple-800',
  SELESAI: 'bg-green-100 text-green-800',
  DIBATALKAN: 'bg-red-100 text-red-800',
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

export const RecentReservations = ({ reservations }: RecentReservationsProps) => (
  <div className="bg-white rounded-xl border border-amber-100 p-5">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-serif font-bold text-[#1a120b] text-lg">Reservasi Terbaru</h3>
      <Link href="/admin/reservasi" className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-0.5">
        Lihat semua <ChevronRight className="w-3 h-3" />
      </Link>
    </div>

    {reservations.length === 0 ? (
      <p className="text-sm text-gray-400 py-6 text-center">Belum ada reservasi</p>
    ) : (
      <div className="space-y-3">
        {reservations.slice(0, 5).map((r) => {
          const firstDetail = r.details?.[0];
          return (
            <div key={r.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0">
                {r.kode_reservasi.slice(-4)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1a120b] truncate">
                  {firstDetail?.space?.nama_space || 'Space reservasi'}
                </p>
                <p className="text-[11px] text-gray-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {r.owner?.nama_coworking || ''} • {formatDate(r.tanggal_reservasi)} • {r.jam_mulai}
                  {r.durasi_jam > 1 ? `-${Number(r.jam_mulai.slice(0,2)) + r.durasi_jam}:00` : ''}
                </p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                {RESERVASI_STATUS_LABEL[r.status] || r.status}
              </span>
            </div>
          );
        })}
      </div>
    )}
  </div>
);