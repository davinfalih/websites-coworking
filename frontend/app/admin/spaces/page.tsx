// app/admin/spaces/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Users, Building2, Search, Star } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1a120b]">Kelola Space</h1>
          <p className="text-sm text-gray-500 mt-1">Tambah, ubah, atau hapus space coworking-mu.</p>
        </div>
        <Link href="/admin/spaces/add" className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-sm font-semibold px-5 py-3 rounded-xl transition shadow-lg shadow-amber-900/20">
          <Plus className="w-4 h-4" /> Tambah Space
        </Link>
      </div>

      {message && (
        <div className={`text-sm px-4 py-3 rounded-xl border ${message.type === 'success' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama space..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm"
          />
        </div>
        <select
          value={tipe}
          onChange={(e) => setTipe(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-amber-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm text-[#1a120b]"
        >
          <option value="ALL">Semua Tipe</option>
          {Object.entries(SPACE_TYPE_LABEL).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-amber-100 p-5 animate-pulse h-52" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-amber-600/60" />
          </div>
          <p className="text-gray-500 text-sm">Belum ada space. Tambahkan space pertamamu!</p>
          <Link href="/admin/spaces/add" className="inline-flex items-center gap-2 mt-4 text-amber-700 font-semibold text-sm hover:gap-3 transition-all">
            <Plus className="w-4 h-4" /> Tambah Space
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((space) => (
            <div key={space.id} className="bg-white rounded-2xl border border-amber-100 overflow-hidden hover:shadow-lg hover:shadow-amber-900/8 transition-all duration-300 flex flex-col">
              <div className="relative h-36 bg-gradient-to-br from-[#1a0f08] to-amber-900 overflow-hidden">
                {space.foto ? (
                  <img src={space.foto} alt={space.nama_space} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-amber-600/40" />
                  </div>
                )}
                <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm border border-amber-600/40">
                  <span className="text-[9px] font-bold tracking-wider uppercase text-amber-300">
                    {SPACE_TYPE_LABEL[space.tipe] || space.tipe}
                  </span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-serif font-semibold text-[#1a120b] mb-1">{space.nama_space}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-amber-600/60" /> Kap. {space.kapasitas} org</span>
                  {space.diskon && (
                    <span className="flex items-center gap-1 text-red-500"><Star className="w-3 h-3" /> -{space.diskon.persentase_diskon}% {space.diskon.kode_diskon}</span>
                  )}
                </div>
                <p className="text-xl font-bold text-amber-700">{formatRupiah(space.harga_per_jam)}<span className="text-xs font-normal text-gray-400">/jam</span></p>
                <div className="flex gap-2 pt-3 mt-3 border-t border-amber-50 mt-auto">
                  <Link href={`/admin/spaces/${space.id}`} className="flex-1 flex items-center justify-center gap-2 border border-amber-200 text-amber-700 hover:bg-amber-50 text-sm font-medium py-2 rounded-lg transition">
                    <Pencil className="w-3.5 h-3.5" /> Ubah
                  </Link>
                  <button onClick={() => handleDelete(space.id)} className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium py-2 rounded-lg transition">
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
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