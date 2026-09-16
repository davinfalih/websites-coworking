// app/customer/spaces/[id]/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Building2,
  CalendarDays,
  Clock,
  Ticket,
  CheckCircle2,
  Sparkles,
  Armchair,
  Wifi,
  Coffee,
  Sun,
} from 'lucide-react';
import { api, SPACE_TYPE_LABEL, formatRupiah } from '@/lib/api';
import type { Space, Diskon } from '@/types';

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);
const DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8];

const todayInput = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function SpaceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [space, setSpace] = useState<Space | null>(null);
  const [diskonList, setDiskonList] = useState<Diskon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tanggal, setTanggal] = useState(todayInput());
  const [jamMulai, setJamMulai] = useState('09:00');
  const [durasi, setDurasi] = useState(2);
  const [kodeDiskon, setKodeDiskon] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getSpaceById(id), api.getDiskon().catch(() => [])])
      .then(([sp, dk]) => {
        setSpace(sp);
        setDiskonList(dk || []);
      })
      .catch((e: any) => setError(e?.message || 'Space tidak ditemukan.'))
      .finally(() => setLoading(false));
  }, [id]);

  const matchedDiskon = useMemo(() => {
    if (!kodeDiskon.trim()) return null;
    const now = new Date();
    return (
      diskonList.find(
        (d) =>
          d.kode_diskon.toLowerCase() === kodeDiskon.trim().toLowerCase() &&
          new Date(d.tanggal_awal) <= now &&
          new Date(d.tanggal_akhir) >= now,
      ) || null
    );
  }, [kodeDiskon, diskonList]);

  const baseTotal = useMemo(() => (space ? space.harga_per_jam * durasi : 0), [space, durasi]);
  const diskonAmount = useMemo(
    () => (matchedDiskon ? Math.round((baseTotal * Number(matchedDiskon.persentase_diskon)) / 100) : 0),
    [matchedDiskon, baseTotal],
  );
  const finalTotal = baseTotal - diskonAmount;

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      if (!space) throw new Error('Space tidak ditemukan.');
      const reservasi = await api.createReservasi({
        tanggal_reservasi: tanggal,
        jam_mulai: jamMulai,
        durasi_jam: durasi,
        id_owner: space.id_owner,
        items: [{ id_space: space.id, kode_diskon: kodeDiskon.trim() || undefined }],
      });
      setMessage({ type: 'success', text: 'Reservasi berhasil dibuat!' });
      setTimeout(() => router.push(`/customer/reservasi/${reservasi.id}`), 600);
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Gagal membuat reservasi.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="h-64 bg-slate-100" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-slate-100 rounded w-2/3" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-full" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-sm mb-6">{error}</p>
        <Link href="/customer/spaces" className="text-brand-700 font-semibold text-sm hover:underline">
          Kembali ke daftar
        </Link>
      </div>
    );
  }

  if (!space) return null;

  const tipeLabel = SPACE_TYPE_LABEL[space.tipe] || space.tipe;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/customer/spaces"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-700 transition group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Kembali ke Katalog
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-xs text-slate-800 font-medium">{space.nama_space}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8">

        {/* LEFT: Detail */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
            {/* Image */}
            <div className="relative aspect-[16/9] bg-slate-100">
              {space.foto ? (
                <img src={space.foto} alt={space.nama_space} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Building2 className="w-14 h-14 text-slate-300" />
                  <span className="mt-3 text-xs uppercase tracking-widest text-slate-400 font-semibold">{tipeLabel}</span>
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600 text-white shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Tersedia
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-sm text-white">
                  {tipeLabel}
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-6">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{space.nama_space}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-brand-700" />
                  {space.owner?.nama_coworking || 'Coworking Space'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-700" />
                  Kapasitas {space.kapasitas} orang
                </span>
              </div>

              {/* Facilities */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Wifi, label: 'WiFi Kencang' },
                  { icon: Coffee, label: 'Pantry & Kopi' },
                  { icon: Armchair, label: 'Kursi Ergonomis' },
                  { icon: Sun, label: 'Pencahayaan Alami' },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <f.icon className="w-5 h-5 text-brand-700" />
                    <span className="text-[10px] text-slate-500 text-center">{f.label}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              {space.deskripsi && (
                <div className="mt-6">
                  <h3 className="font-bold text-slate-900 mb-2 text-sm">Deskripsi &amp; Fasilitas</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{space.deskripsi}</p>
                </div>
              )}

              {/* Active Promo */}
              {space.diskon && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Promo aktif: {space.diskon.nama_diskon || space.diskon.kode_diskon} ({space.diskon.persentase_diskon}%)
                  <span className="font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded-md">{space.diskon.kode_diskon}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Booking Form */}
        <div className="lg:sticky lg:top-6 h-fit">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Header */}
            <div className="bg-brand-700 px-6 py-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold text-white">Reservasi Space</h2>
                <span className="text-emerald-200/80 text-xs">{tipeLabel}</span>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold text-white font-mono">{formatRupiah(space.harga_per_jam)}</span>
                <span className="text-emerald-100/70 text-xs ml-1">/ jam</span>
              </div>
            </div>

            <form onSubmit={handleReserve} className="p-6 space-y-5">
              {/* Date */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-brand-700" /> Tanggal Reservasi
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayInput()}
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full pl-3.5 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition"
                  />
                </div>
              </div>

              {/* Time & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-700" /> Jam Mulai
                  </label>
                  <div className="relative">
                    <select
                      value={jamMulai}
                      onChange={(e) => setJamMulai(e.target.value)}
                      className="w-full pl-3.5 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 appearance-none transition"
                    >
                      {HOURS.map((h) => (
                        <option key={h} value={`${String(h).padStart(2, '0')}:00`}>
                          {String(h).padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-700" /> Durasi (jam)
                  </label>
                  <div className="relative">
                    <select
                      value={durasi}
                      onChange={(e) => setDurasi(Number(e.target.value))}
                      className="w-full pl-3.5 pr-8 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 appearance-none transition"
                    >
                      {DURATIONS.map((d) => (
                        <option key={d} value={d}>{d} jam</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discount Code */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1.5">
                  <Ticket className="w-3.5 h-3.5 text-brand-700" /> Kode Diskon (opsional)
                </label>
                <input
                  type="text"
                  value={kodeDiskon}
                  onChange={(e) => setKodeDiskon(e.target.value.toUpperCase())}
                  placeholder="Contoh: DISKON10"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition font-mono uppercase"
                />
                {kodeDiskon.trim() && !matchedDiskon && (
                  <p className="text-xs text-red-500 mt-1.5">Kode diskon tidak valid atau belum berlaku.</p>
                )}
                {matchedDiskon && (
                  <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {matchedDiskon.nama_diskon || matchedDiskon.kode_diskon} berlaku! Potongan {matchedDiskon.persentase_diskon}%.
                  </p>
                )}
              </div>

              {/* Pricing Summary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Harga space ({durasi} jam)</span>
                  <span className="font-mono">{formatRupiah(baseTotal)}</span>
                </div>
                {matchedDiskon && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Diskon {matchedDiskon.kode_diskon} (-{matchedDiskon.persentase_diskon}%)</span>
                    <span className="font-mono">-{formatRupiah(diskonAmount)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900">
                  <span>Total Estimasi</span>
                  <span className="text-brand-700 font-mono">{formatRupiah(finalTotal)}</span>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`text-sm px-4 py-3 rounded-xl border ${message.type === 'success' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-red-600 bg-red-50 border-red-100'}`}>
                  {message.text}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-600 active:bg-brand-800 text-white font-semibold py-3 rounded-lg transition-all shadow-sm shadow-teal-900/10 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <CalendarDays className="w-4 h-4" />
                    Reservasi Sekarang
                  </>
                )}
              </button>
              <p className="text-[10px] text-slate-400 text-center">
                Reservasi akan ditinjau oleh pengelola sebelum terkonfirmasi.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}