// app/customer/spaces/[id]/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  MapPin,
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

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00 - 19:00
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

  const baseTotal = useMemo(
    () => (space ? space.harga_per_jam * durasi : 0),
    [space, durasi],
  );

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

  const detailImg = space?.foto ? space.foto : null;

  return (
    <div className="bg-[#faf6f0] min-h-screen">
      <section className="relative bg-gradient-to-br from-[#1a0f08] via-[#1a0f08] to-amber-900">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 py-8">
          <Link href="/customer/spaces" className="inline-flex items-center gap-2 text-amber-200/70 hover:text-amber-200 text-sm transition">
            <ArrowLeft className="w-4 h-4" /> Kembali ke daftar space
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-16">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Memuat space...</div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-sm mb-6">{error}</p>
            <Link href="/customer/spaces" className="text-amber-700 font-semibold text-sm hover:underline">
              Kembali ke daftar
            </Link>
          </div>
        ) : space ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8">
            {/* Kiri: detail */}
            <div className="space-y-6">
              {/* Foto + gambaran */}
              <div className="rounded-2xl overflow-hidden border border-amber-100 bg-white">
                <div className="relative aspect-[16/9] bg-gradient-to-br from-[#1a0f08] to-amber-900">
                  {detailImg ? (
                    <img src={detailImg} alt={space.nama_space} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Building2 className="w-14 h-14 text-amber-600/40" />
                      <span className="mt-3 text-xs uppercase tracking-widest text-amber-500/50 font-semibold">
                        {SPACE_TYPE_LABEL[space.tipe]}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-amber-600/40">
                    <span className="text-xs font-bold tracking-wider uppercase text-amber-300">
                      {SPACE_TYPE_LABEL[space.tipe]}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#1a120b]">{space.nama_space}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" /> {space.owner?.nama_coworking || 'Coworking Space'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-600" /> Kapasitas {space.kapasitas} orang
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-600" /> Jakarta
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { icon: Wifi, label: 'WiFi Kencang' },
                      { icon: Coffee, label: 'Pantry & Kopi' },
                      { icon: Armchair, label: 'Kursi Ergonomis' },
                      { icon: Sun, label: 'Pencahayaan Alami' },
                    ].map((f) => (
                      <div key={f.label} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-amber-100 bg-[#faf6f0]">
                        <f.icon className="w-5 h-5 text-amber-600" />
                        <span className="text-[10px] text-gray-500 text-center">{f.label}</span>
                      </div>
                    ))}
                  </div>

                  {space.deskripsi && (
                    <div className="mt-6">
                      <h3 className="font-serif font-bold text-[#1a120b] mb-2">Deskripsi & Fasilitas</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{space.deskripsi}</p>
                    </div>
                  )}

                  {space.diskon && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
                      <Sparkles className="w-4 h-4" />
                      Promo aktif: {space.diskon.nama_diskon || space.diskon.kode_diskon} ({space.diskon.persentase_diskon}%)
                      <span className="font-mono font-bold bg-red-100 px-1.5 py-0.5 rounded-md">{space.diskon.kode_diskon}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kanan: booking */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-xl shadow-amber-900/8">
                <div className="bg-gradient-to-r from-amber-700 to-amber-600 px-6 py-4">
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-serif text-lg text-white">Reservasi Space</h2>
                    <span className="text-amber-100/80 text-xs">{SPACE_TYPE_LABEL[space.tipe]}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-2xl font-bold text-white">{formatRupiah(space.harga_per_jam)}</span>
                    <span className="text-amber-100/70 text-xs ml-1">/ jam</span>
                  </div>
                </div>

                <form onSubmit={handleReserve} className="p-6 space-y-5">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
                      <CalendarDays className="w-4 h-4 text-amber-600" /> Tanggal Reservasi
                    </label>
                    <input
                      type="date"
                      min={todayInput()}
                      value={tanggal}
                      onChange={(e) => setTanggal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
                        <Clock className="w-4 h-4 text-amber-600" /> Jam Mulai
                      </label>
                      <select
                        value={jamMulai}
                        onChange={(e) => setJamMulai(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm"
                      >
                        {HOURS.map((h) => (
                          <option key={h} value={`${String(h).padStart(2, '0')}:00`}>
                            {String(h).padStart(2, '0')}:00
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
                        <Clock className="w-4 h-4 text-amber-600" /> Durasi (jam)
                      </label>
                      <select
                        value={durasi}
                        onChange={(e) => setDurasi(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm"
                      >
                        {DURATIONS.map((d) => (
                          <option key={d} value={d}>{d} jam</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
                      <Ticket className="w-4 h-4 text-amber-600" /> Kode Diskon (opsional)
                    </label>
                    <input
                      type="text"
                      value={kodeDiskon}
                      onChange={(e) => setKodeDiskon(e.target.value.toUpperCase())}
                      placeholder="Contoh: DISKON10"
                      className="w-full px-4 py-2.5 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm font-mono uppercase"
                    />
                    {kodeDiskon.trim() && !matchedDiskon && (
                      <p className="text-xs text-red-500 mt-1.5">Kode diskon tidak valid atau belum berlaku.</p>
                    )}
                    {matchedDiskon && (
                      <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {matchedDiskon.nama_diskon || matchedDiskon.kode_diskon} berlaku! Potongan {matchedDiskon.persentase_diskon}%.
                      </p>
                    )}
                  </div>

                  {/* Estimasi */}
                  <div className="rounded-xl border border-amber-100 bg-[#faf6f0] p-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Harga space ({durasi} jam)</span>
                      <span>{formatRupiah(baseTotal)}</span>
                    </div>
                    {matchedDiskon && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon {matchedDiskon.kode_diskon} (-{matchedDiskon.persentase_diskon}%)</span>
                        <span>-{formatRupiah(diskonAmount)}</span>
                      </div>
                    )}
                    <div className="border-t border-amber-100 pt-2 flex justify-between font-bold text-[#1a120b]">
                      <span>Total Estimasi</span>
                      <span className="text-amber-700">{formatRupiah(finalTotal)}</span>
                    </div>
                  </div>

                  {message && (
                    <div className={`text-sm px-4 py-3 rounded-xl border ${message.type === 'success' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
                      {message.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <CalendarDays className="w-4 h-4" /> Reservasi Sekarang
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">
                    Reservasi akan ditinjau oleh pengelola sebelum terkonfirmasi.
                  </p>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}