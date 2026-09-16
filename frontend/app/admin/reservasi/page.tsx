// app/admin/reservasi/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, XCircle, LogIn, LogOut, Search, RefreshCw } from 'lucide-react';
import { createClient, RESERVASI_STATUS_LABEL, formatRupiah, formatDate } from '@/lib/api';
import type { Reservasi } from '@/types';

const statusColors: Record<string, string> = {
  BELUM_DIKONFIRM: 'bg-yellow-100 text-yellow-800',
  DISETUJUI: 'bg-blue-100 text-blue-800',
  AKTIF: 'bg-purple-100 text-purple-800',
  SELESAI: 'bg-green-100 text-green-800',
  DIBATALKAN: 'bg-red-100 text-red-800',
};

const currentMonth = () => new Date().toISOString().slice(0, 7);

export default function AdminReservasiPage() {
  const client = createClient();
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
      const res = await client.getAllReservations(params);
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
          (r.member?.nama_member || '').toLowerCase().includes(search.toLowerCase()) ||
          (r.details?.[0]?.space?.nama_space || '').toLowerCase().includes(search.toLowerCase()),
      );
    }
    setFiltered(list);
  }, [items, search]);

  const run = async (fn: () => Promise<unknown>, id: number, successText: string) => {
    setBusyId(id);
    setMessage(null);
    try {
      await fn();
      setMessage({ type: 'success', text: successText });
      load(month, status);
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Operasi gagal.' });
    } finally {
      setBusyId(null);
    }
  };

  const approve = (id: number) => run(() => client.updateReservationStatus(id, 'DISETUJUI'), id, 'Reservasi disetujui.');
  const cancel = (id: number) => run(() => client.updateReservationStatus(id, 'DIBATALKAN'), id, 'Reservasi dibatalkan.');
  const checkIn = (id: number) => run(() => client.checkIn(id), id, 'Member check-in.');
  const checkOut = (id: number) => run(() => client.checkOut(id), id, 'Member check-out.');

  const totalDisplay = filtered.filter((r) => r.status !== 'DIBATALKAN').reduce((sum, r) => sum + (r.details?.reduce((s, d) => s + (d.total_harga || 0), 0) || 0), 0);

  const ActionButtons = ({ r }: { r: Reservasi }) => {
    const busy = busyId === r.id;
    const disabled = busy || loading;
    return (
      <div className="flex flex-wrap gap-1.5">
        {r.status === 'BELUM_DIKONFIRM' && (
          <>
            <button onClick={() => approve(r.id)} disabled={disabled} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50">
              <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
            </button>
            <button onClick={() => cancel(r.id)} disabled={disabled} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50">
              <XCircle className="w-3.5 h-3.5" /> Batalkan
            </button>
          </>
        )}
        {r.status === 'DISETUJUI' && (
          <button onClick={() => checkIn(r.id)} disabled={disabled} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition disabled:opacity-50">
            <LogIn className="w-3.5 h-3.5" /> Check-in
          </button>
        )}
        {r.status === 'AKTIF' && (
          <button onClick={() => checkOut(r.id)} disabled={disabled} className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-50">
            <LogOut className="w-3.5 h-3.5" /> Check-out
          </button>
        )}
        {(r.status === 'DIBATALKAN' || r.status === 'SELESAI') && (
          <span className="text-[11px] text-gray-400 italic">Selesai</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Kelola Reservasi</h1>
          <p className="text-sm text-slate-500 mt-1">Pantau dan proses semua reservasi member.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
          <span>Total (tanpa batal):</span>
          <span className="font-bold text-emerald-700">{formatRupiah(totalDisplay)}</span>
        </div>
      </div>

      {message && (
        <div className={`text-sm px-4 py-3 rounded-xl border ${message.type === 'success' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-emerald-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kode, member, atau space..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm" />
        </div>
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm text-slate-900" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm text-slate-900">
          <option value="ALL">Semua Status</option>
          {Object.entries(RESERVASI_STATUS_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <button onClick={() => load(month, status)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-emerald-700 hover:bg-emerald-50 text-sm font-medium transition">
          <RefreshCw className="w-4 h-4" /> Muat Ulang
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-gray-400 text-sm">Memuat reservasi...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <CalendarClock className="w-6 h-6 text-emerald-600/60" />
          </div>
          <p className="text-gray-500 text-sm">Belum ada reservasi pada periode ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const firstDetail = r.details?.[0];
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-emerald-700 font-semibold text-xs">
                      {r.kode_reservasi.slice(-4)}
                    </div>
                    <div>
                      <p className="font-mono font-semibold text-sm text-slate-900">{r.kode_reservasi}</p>
                      <p className="text-xs text-gray-400">
                        {r.member?.nama_member || '-'} • {formatDate(r.tanggal_reservasi)} • {r.jam_mulai}{Number(r.jam_mulai.slice(0, 2)) + r.durasi_jam}:00
                      </p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${statusColors[r.status] || 'bg-gray-100 text-gray-700'}`}>
                    {RESERVASI_STATUS_LABEL[r.status] || r.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-xl p-3">
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
                    <span>
                      Space: <span className="font-medium text-slate-900">{firstDetail?.space?.nama_space || '-'}</span>
                    </span>
                    <span>Durasi: <span className="font-medium text-slate-900">{r.durasi_jam} jam</span></span>
                    <span>
                      Pengelola: <span className="font-medium text-slate-900">{r.owner?.nama_coworking || '-'}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-bold text-emerald-700">
                      {formatRupiah(firstDetail?.total_harga || 0)}
                    </span>
                    <ActionButtons r={r} />
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