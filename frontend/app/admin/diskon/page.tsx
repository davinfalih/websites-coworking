// app/admin/diskon/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Percent, Search, Star } from 'lucide-react';
import { createClient } from '@/lib/api';
import type { Diskon } from '@/types';

const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const isActive = (d: Diskon) => {
  const now = new Date();
  return new Date(d.tanggal_awal) <= now && new Date(d.tanggal_akhir) >= now;
};

export default function AdminDiskonPage() {
  const client = createClient();
  const [items, setItems] = useState<Diskon[]>([]);
  const [filtered, setFiltered] = useState<Diskon[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.getDiskon();
      setItems(res || []);
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Gagal memuat daftar diskon.' });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let list = items;
    if (filter === 'ACTIVE') list = list.filter(isActive);
    if (filter === 'EXPIRED') list = list.filter((d) => !isActive(d));
    if (search.trim()) list = list.filter((d) => d.kode_diskon.toLowerCase().includes(search.toLowerCase()) || (d.nama_diskon || '').toLowerCase().includes(search.toLowerCase()));
    setFiltered(list);
  }, [items, search, filter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus diskon ini?')) return;
    try {
      await client.deleteDiskon(id);
      setMessage({ type: 'success', text: 'Diskon berhasil dihapus.' });
      load();
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Gagal menghapus diskon.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1a120b]">Kelola Diskon</h1>
          <p className="text-sm text-gray-500 mt-1">Buat dan kelola kode promo potongan harga.</p>
        </div>
        <Link href="/admin/diskon/add" className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-sm font-semibold px-5 py-3 rounded-xl transition shadow-lg shadow-amber-900/20">
          <Plus className="w-4 h-4" /> Tambah Diskon
        </Link>
      </div>

      {message && (
        <div className={`text-sm px-4 py-3 rounded-xl border ${message.type === 'success' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kode atau nama diskon..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-amber-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm text-[#1a120b]">
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="EXPIRED">Kadaluarsa</option>
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center text-gray-400 text-sm">Memuat diskon...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <Percent className="w-6 h-6 text-amber-600/60" />
          </div>
          <p className="text-gray-500 text-sm">Belum ada diskon. Buat promo pertamamu!</p>
          <Link href="/admin/diskon/add" className="inline-flex items-center gap-2 mt-4 text-amber-700 font-semibold text-sm hover:gap-3 transition-all">
            <Plus className="w-4 h-4" /> Tambah Diskon
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-100 bg-[#faf6f0] text-left text-xs uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3.5">Kode</th>
                <th className="px-5 py-3.5">Nama</th>
                <th className="px-5 py-3.5">Diskon</th>
                <th className="px-5 py-3.5">Periode</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const active = isActive(d);
                return (
                  <tr key={d.id} className="border-b border-amber-50 hover:bg-amber-50/40 transition">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1">
                        <Star className="w-3 h-3 text-amber-500" /> {d.kode_diskon}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#1a120b]">{d.nama_diskon || '-'}</td>
                    <td className="px-5 py-4 font-bold text-red-600">-{d.persentase_diskon}%</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {formatDate(d.tanggal_awal)} → {formatDate(d.tanggal_akhir)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-semibold px-2 py-1 rounded-md ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                        {active ? 'AKTIF' : 'KADALUARSA'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/diskon/${d.id}`} className="p-2 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => handleDelete(d.id)} className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}