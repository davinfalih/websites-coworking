// app/customer/reservasi/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarClock, Search, XCircle, RefreshCw, ChevronRight } from 'lucide-react';
import { api, RESERVASI_STATUS_LABEL, formatRupiah, formatDate } from '@/lib/api';
import type { Reservasi } from '@/types';

const statusColors: Record<string, string> = {
  BELUM_DIKONFIRM: 'bg-yellow-100 text-yellow-800',
  DISETUJUI: 'bg-blue-100 text-blue-800',
  AKTIF: 'bg-purple-100 text-purple-800',
  SELESAI: 'bg-green-100 text-green-800',
  DIBATALKAN: 'bg-red-100 text-red-800',
};

const currentMonth = () => new Date().toISOString().slice(0, 7);

export default function MyReservasiPage() {
  const [items, setItems] = useState<Reservasi[]>([]);
  const [filtered, setFiltered] = useState<Reservasi[]>([]);
  const [month, setMonth] = useState(currentMonth());
  const [status, setStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async (m: string, s: string) => {
    setLoading(true);
    try {
      const params: { month?: string; status?: string } = {};
      if (m) params.month = m;
      if (s && s !== 'ALL') params.status = s;
      const res = await api.getMyReservations(params);
      setItems(res || []);
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Gagal memuat reservasi.' });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(month, status);
  }, [month, status]);

  useEffect(() => {
    let list = items;
    if (search.trim()) {
      list = list.filter(
        (r) =>
          r.kode_reservasi.toLowerCase().includes(search.toLowerCase()) ||
          (r.details?.[0]?.space?.nama_space || '').toLowerCase().includes(search.toLowerCase()),
      );
    }
    setFiltered(list);
  }, [items, search]);

  const cancelReservation = async (id: number) => {
    if (!confirm('Yakin ingin membatalkan reservasi ini?')) return;
    setBusyId(id);
    setMessage(null);
    try {
      await api.updateReservationStatus(id, 'DIBATALKAN');
      setMessage({ type: 'success', text: 'Reservasi berhasil dibatalkan.' });
      load(month, status);
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Gagal membatalkan reservasi.' });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#1a120b]">Reservasi Saya</h1>
        <p className="text-sm text-gray-500 mt-1">Riwayat dan status reservasi space-mu.</p>
      </div>

      {message && (
        <div className={`text-sm px-4 py-3 rounded-xl border ${message.type === 'success' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kode atau nama space..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm" />
        </div>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="px-4 py-2.5 rounded-xl border border-amber-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm text-[#1a120b]" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2.5 rounded-xl border border-amber-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm text-[#1a120b]">
          <option value="ALL">Semua Status</option>
          {Object.entries(RESERVASI_STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button onClick={() => load(month, status)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 text-sm font-medium transition">
          <RefreshCw className="w-4 h-4" /> Muat Ulang
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center text-gray-400 text-sm">Memuat reservasi...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <CalendarClock className="w-6 h-6 text-amber-600/60" />
          </div>
          <p className="text-gray-500 text-sm mb-4">Belum ada reservasi pada periode ini.</p>
          <Link href="/customer/spaces" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 text-white text-sm font-semibold px-5 py-3 rounded-xl transition hover:from-amber-600 hover:to-amber-500">
            Jelajahi Space
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const firstDetail = r.details?.[0];
            const canCancel = r.status === 'BELUM_DIKONFIRM';
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-amber-100 overflow-hidden hover:shadow-lg hover:shadow-amber-900/8 transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <Link href={`/customer/reservasi/${r.id}`} className="font-mono font-bold text-sm text-[#1a120b] hover:text-amber-700 transition">
                        {r.kode_reservasi}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(r.tanggal_reservasi)} • {r.jam_mulai}{Number(r.jam_mulai.slice(0, 2)) + r.durasi_jam > 24 ? ' (besok)' : ''} ({r.durasi_jam} jam)
                      </p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-md ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                      {RESERVASI_STATUS_LABEL[r.status] || r.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#1a0f08] to-amber-900 flex items-center justify-center shrink-0">
                      {firstDetail?.space?.foto ? (
                        <img src={firstDetail.space.foto} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-amber-500/60 uppercase tracking-widest">
                          {firstDetail?.space?.tipe?.slice(0, 2) || 'SP'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a120b] truncate">{firstDetail?.space?.nama_space || '-'}</p>
                      <p className="text-xs text-gray-400 truncate">{r.owner?.nama_coworking || '-'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-amber-700">{formatRupiah(firstDetail?.total_harga || 0)}</p>
                      {firstDetail?.diskon && (
                        <p className="text-[10px] text-red-500">Diskon {firstDetail.diskon.persentase_diskon}%</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-amber-50">
                    <Link href={`/customer/reservasi/${r.id}`} className="flex-1 flex items-center justify-center gap-1.5 bg-[#faf6f0] hover:bg-amber-50 text-amber-700 text-sm font-medium py-2.5 rounded-xl transition">
                      Lihat E-Ticket <ChevronRight className="w-4 h-4" />
                    </Link>
                    {canCancel && (
                      <button onClick={() => cancelReservation(r.id)} disabled={busyId === r.id} className="flex items-center justify-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium px-4 py-2.5 rounded-xl transition disabled:opacity-50">
                        <XCircle className="w-4 h-4" /> Batalkan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}