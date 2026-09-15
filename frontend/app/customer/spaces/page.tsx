// app/customer/spaces/page.tsx
'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, Building2 } from 'lucide-react';
import { api, SPACE_TYPE_LABEL } from '@/lib/api';
import type { Space } from '@/types';
import SpaceCard from '@/components/space/SpaceCard';

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
    <main className="bg-[#faf6f0] min-h-screen">
      {/* Hero header */}
      <section className="relative bg-gradient-to-br from-[#1a0f08] via-[#1a0f08] to-amber-900 py-10 md:py-14">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
            Jelajahi <span className="text-amber-400">Space</span> Kami
          </h1>
          <p className="text-amber-100/60 text-sm md:text-base mt-2 max-w-xl mx-auto">
            Pilih space favoritmu dan reservasi dalam hitungan menit.
          </p>

          <div className="max-w-xl mx-auto mt-6">
            <div className="relative">
              <Search className="w-4 h-4 text-amber-400/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari space atau coworking..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-white/10 border border-amber-600/30 focus:border-amber-500 focus:bg-white/15 text-white placeholder:text-amber-100/40 outline-none transition text-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-100/50 hover:text-amber-200">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Tipe:
            </span>
            {[{ k: 'ALL', v: 'Semua' }, ...Object.entries(SPACE_TYPE_LABEL).map(([k, v]) => ({ k, v }))].map((opt) => (
              <button
                key={opt.k}
                onClick={() => setTipe(opt.k)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  tipe === opt.k
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-lg shadow-amber-900/30'
                    : 'bg-white/10 text-amber-100/70 border border-amber-600/30 hover:bg-white/15'
                }`}
              >
                {opt.v} <span className="opacity-60">({counts[opt.k] ?? 0})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-10 py-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="w-40 md:w-52 bg-gray-200 animate-pulse rounded-xl aspect-[3/4]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-sm py-12">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-amber-600/50" />
            </div>
            <p className="text-gray-500 text-sm">Tidak ada space yang cocok dengan pencarianmu.</p>
            <button onClick={() => { setSearch(''); setTipe('ALL'); }} className="mt-4 text-amber-700 font-semibold text-sm hover:underline">
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center">
            {filtered.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function SpacesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf6f0]" />}>
      <SpacesContent />
    </Suspense>
  );
}