// app/spaces/page.tsx
'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { X, Building2, ArrowRight } from 'lucide-react';
import { api, SPACE_TYPE_LABEL } from '@/lib/api';
import type { Space } from '@/types';
import Navbar from '@/components/navbar/Navbar';
import SpaceCard from '@/components/space/SpaceCard';

function SpacesCatalog() {
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-800 py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-emerald-400/30 text-emerald-200 text-xs font-medium backdrop-blur-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {spaces.length} Space Tersedia
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Katalog & Ketersediaan Ruang Kerja
            </h1>
            <p className="text-emerald-100/80 text-sm md:text-base mt-4 leading-relaxed">
              Pilih workstation tenang, focus pod kedap suara, atau ruang meeting representatif.
              Lihat bebas tanpa login — buat reservasi hanya dalam hitungan langkah.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-10 -mt-8 relative z-10 pb-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 lg:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                    tipe === opt.k ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200/70 text-slate-600'
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
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-10 pb-8">
        <div className="relative flex-1 mb-6">
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
            className="w-full pl-9 pr-9 py-3 text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition shadow-sm"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 animate-pulse overflow-hidden">
                <div className="h-40 bg-slate-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">Tidak ada space yang cocok dengan pencarianmu.</p>
            <button
              onClick={() => { setSearch(''); setTipe('ALL'); }}
              className="mt-4 text-emerald-700 font-semibold text-sm hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((space) => (
              <SpaceCard key={space.id} space={space} reserveHref={`/spaces/${space.id}`} />
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 sm:px-6 lg:px-10 pb-20 text-center">
        <Link
          href="/#cara-booking"
          className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:gap-3 transition-all"
        >
          Pelajari Cara Booking <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm">© 2026 Nexus Workstation & Booking. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/sign-in" className="hover:text-emerald-400 transition">Masuk</Link>
            <Link href="/sign-up" className="hover:text-emerald-400 transition">Daftar Member</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function PublicSpacesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <SpacesCatalog />
    </Suspense>
  );
}