// app/admin/spaces/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Users, Building2, Search, Star, Wallet } from 'lucide-react';
import { createClient, SPACE_TYPE_LABEL, formatRupiah } from '@/lib/api';
import type { Space } from '@/types';

export default function AdminSpacesPage() {
  const client = createClient();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filtered, setFiltered] = useState<Space[]>([]);
  const [search, setSearch] = useState('');
  const [tipe, setTipe] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const totalKapasitas = spaces.reduce((sum, s) => sum + (Number(s.kapasitas) || 0), 0);
  const rataHarga = spaces.length
    ? Math.round(spaces.reduce((sum, s) => sum + (Number(s.harga_per_jam) || 0), 0) / spaces.length)
    : 0;
  const tipeCounts = spaces.reduce<Record<string, number>>((acc, s) => {
    acc[s.tipe] = (acc[s.tipe] || 0) + 1;
    return acc;
  }, {});
  const dominantTipe = Object.entries(tipeCounts).sort((a, b) => b[1] - a[1])[0];

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.getMySpaces();
      setSpaces(res || []);
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Gagal memuat daftar space.' });
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let list = spaces;
    if (tipe !== 'ALL') list = list.filter((s) => s.tipe === tipe);
    if (search.trim()) {
      list = list.filter((s) => s.nama_space.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(list);
  }, [spaces, search, tipe]);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus space ini?')) return;
    try {
      await client.deleteSpace(id);
      setMessage({ type: 'success', text: 'Space berhasil dihapus.' });
      load();
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Gagal menghapus space.' });
    }
  };

  const kpi = [
    { label: 'Total Ruang', value: spaces.length, footnote: `${tipeCounts.DESK || 0} Desk`, icon: Building2 },
    { label: 'Total Kapasitas', value: totalKapasitas, footnote: 'orang per slot', icon: Users },
    {
      label: 'Ruang Terbanyak',
      value: dominantTipe ? dominantTipe[1] : 0,
      footnote: dominantTipe ? SPACE_TYPE_LABEL[dominantTipe[0]] || dominantTipe[0] : '—',
      icon: Star,
    },
    { label: 'Harga Rata-rata', value: rataHarga ? formatRupiah(rataHarga) : 0, footnote: 'per jam', icon: Wallet },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Manajemen Ruang</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Kelola Space</h1>
          <p className="mt-1 text-sm text-slate-500">Tambah, ubah, atau hapus space coworking-mu.</p>
        </div>
        <Link href="/admin/spaces/add" className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-60">
          <Plus className="h-4 w-4" /> Tambah Space
        </Link>
      </div>

      {message && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${message.type === 'success' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpi.map((k) => (
          <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{k.label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{k.value}</p>
                {k.footnote && <p className="mt-1 text-xs text-slate-400">{k.footnote}</p>}
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <k.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama space..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
          />
        </div>
        <select
          value={tipe}
          onChange={(e) => setTipe(e.target.value)}
          className="px-4 py-2.5 cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
        >
          <option value="ALL">Semua Tipe</option>
          {Object.entries(SPACE_TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white p-5" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600/70">
            <Building2 className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-slate-700">Belum ada space</p>
          <p className="mt-1 text-sm text-slate-500">Tambahkan space pertamamu untuk mulai menyewakan.</p>
          <Link href="/admin/spaces/add" className="mt-4 inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition">
            <Plus className="h-4 w-4" /> Tambah Space
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((space) => (
            <div key={space.id} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] transition-all duration-300 hover:shadow-md">
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-800">
                {space.foto ? (
                  <img src={space.foto} alt={space.nama_space} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Building2 className="h-10 w-10 text-emerald-600/40" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-emerald-900/80 text-white text-[9px] font-semibold tracking-wider uppercase">
                  {SPACE_TYPE_LABEL[space.tipe] || space.tipe}
                </div>
              </div>
              <div className="flex flex-grow flex-col p-4">
                <h3 className="mb-1 font-semibold text-slate-900">{space.nama_space}</h3>
                <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-emerald-600/60" /> Kap. {space.kapasitas} org</span>
                  {space.diskon && (
                    <span className="flex items-center gap-1 text-red-600"><Star className="h-3 w-3" /> -{space.diskon.persentase_diskon}% {space.diskon.kode_diskon}</span>
                  )}
                </div>
                <p className="text-xl font-bold tabular-nums text-emerald-700">{formatRupiah(space.harga_per_jam)}<span className="text-xs font-normal text-gray-400">/jam</span></p>
                <div className="mt-auto flex gap-2 border-t border-slate-100 pt-3 mt-3">
                  <Link href={`/admin/spaces/${space.id}`} className="inline-flex flex-1 items-center justify-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                    <Pencil className="h-3.5 w-3.5" /> Ubah
                  </Link>
                  <button onClick={() => handleDelete(space.id)} className="inline-flex flex-1 items-center justify-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}