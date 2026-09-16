// app/customer/spaces/page.tsx
'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { X, Building2 } from 'lucide-react';
import { api, SPACE_TYPE_LABEL } from '@/lib/api';
import type { Space } from '@/types';
import Link from 'next/link';

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function SpaceCard({ space }: { space: Space }) {
  const tipeLabel = SPACE_TYPE_LABEL[space.tipe] || space.tipe;
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between">
      <div>
        {/* Photo */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          {space.foto ? (
            <img
              src={space.foto}
              alt={space.nama_space}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-slate-300" />
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Tersedia
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-xs text-white">
              {tipeLabel}
            </span>
          </div>
          {space.diskon && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white">
              -{space.diskon.persentase_diskon}%
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="font-bold text-slate-900 text-base group-hover:text-brand-700 transition mb-0.5">
            {space.nama_space}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
            </svg>
            {space.owner?.nama_coworking || 'Coworking Space'}
          </p>

          {space.deskripsi && (
            <p className="text-xs text-slate-600 line-clamp-2 mb-3.5 leading-relaxed">{space.deskripsi}</p>
          )}

          {/* Specs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-brand-800 border border-emerald-200">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
              {space.kapasitas} Orang
            </span>
            <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">⚡ Power Outlet</span>
            <span className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">📶 WiFi</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 pt-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Tarif Sewa</p>
          <p className="text-lg font-bold text-slate-900 font-mono">
            {formatRupiah(space.harga_per_jam)} <span className="text-xs font-normal text-slate-500 font-sans">/ jam</span>
          </p>
        </div>
        <Link
          href={`/customer/spaces/${space.id}`}
          className="px-4 py-2 rounded-lg bg-brand-700 hover:bg-brand-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition"
        >
          <span>Lihat Detail</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

function SpacesContent() {
  const searchParams = useSearchParams();
  const initialTipe = searchParams.get('tipe') || 'ALL';

  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tipe, setTipe] = useState<string>(initialTipe);

  useEffect(() => {
    if (searchParams.get('tipe')) {
      setTipe(searchParams.get('tipe') || 'ALL');
    }
  }, [searchParams]);

  useEffect(() => {
    api
      .getSpaces()
      .then((data) => setSpaces(data || []))
      .catch((e: any) => setError(e?.message || 'Gagal memuat daftar space.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = spaces;
    if (tipe !== 'ALL') list = list.filter((s) => s.tipe === tipe);
    if (search.trim()) {
      list = list.filter(
        (s) =>
          s.nama_space.toLowerCase().includes(search.toLowerCase()) ||
          (s.deskripsi || '').toLowerCase().includes(search.toLowerCase()) ||
          (s.owner?.nama_coworking || '').toLowerCase().includes(search.toLowerCase()),
      );
    }
    return list;
  }, [spaces, search, tipe]);

  const counts = useMemo(() => {
    const res: Record<string, number> = { ALL: spaces.length };
    Object.keys(SPACE_TYPE_LABEL).forEach((k) => {
      res[k] = spaces.filter((s) => s.tipe === k).length;
    });
    return res;
  }, [spaces]);

  return (
    <div className="space-y-6">
      {/* Hero & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-brand-700 border border-emerald-200">
              🌿 Ruang Kerja Siap Dipesan
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">Update langsung per detik ini</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            Katalog &amp; Ketersediaan Ruang Kerja
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Pilih workstation tenang, focus pod kedap suara, atau ruang meeting representatif untuk kebutuhan produktif Anda.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total Slot Tersedia</p>
            <p className="text-lg font-bold text-slate-800 font-mono">
              {spaces.length} <span className="text-xs font-normal text-emerald-600">Unit</span>
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-2xs">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Waktu Buka Hub</p>
            <p className="text-lg font-bold text-slate-800 font-mono">
              24 Jam <span className="text-xs font-normal text-slate-400">Non-Stop</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 lg:p-5 shadow-xs">
        {/* Tab Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl overflow-x-auto">
            {[{ k: 'ALL', v: 'Semua Ruangan' }, ...Object.entries(SPACE_TYPE_LABEL).map(([k, v]) => ({ k, v }))].map((opt) => (
              <button
                key={opt.k}
                onClick={() => setTipe(opt.k)}
                className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  tipe === opt.k
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span>{opt.v}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                  tipe === opt.k ? 'bg-brand-50 text-brand-700' : 'bg-slate-200/70 text-slate-600'
                }`}>
                  {counts[opt.k] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Tersedia
            </span>
            <span className="inline-flex items-center gap-1 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Sisa Sedikit
            </span>
          </div>
        </div>

        {/* Search Row */}
        <div className="pt-4 flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama ruang, meja, tipe pod, atau fasilitas..."
              className="w-full pl-9 pr-9 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 transition"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <span>Urutkan:</span>
            <select className="bg-transparent font-semibold text-slate-700 border-none focus:outline-none cursor-pointer text-xs">
              <option>Rekomendasi Terbaik</option>
              <option>Harga: Terendah ke Tertinggi</option>
              <option>Kapasitas Terbesar</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800">Daftar Ruang &amp; Meja Tersedia</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono font-medium">
              {filtered.length} Pilihan
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 animate-pulse overflow-hidden">
                <div className="h-48 bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">Tidak ada space yang cocok dengan pencarianmu.</p>
            <button
              onClick={() => { setSearch(''); setTipe('ALL'); }}
              className="mt-4 text-brand-700 font-semibold text-sm hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function SpacesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <SpacesContent />
    </Suspense>
  );
}