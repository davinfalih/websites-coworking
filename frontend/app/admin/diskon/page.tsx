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
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Manajemen Diskon</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Kelola Diskon</h1>
          <p className="mt-1 text-sm text-slate-500">Buat dan kelola kode promo potongan harga.</p>
        </div>
        <Link href="/admin/diskon/add" className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-60">
          <Plus className="w-4 h-4" /> Tambah Diskon
        </Link>
      </div>

      {message && (
        <div className={`text-sm px-4 py-3 rounded-xl border ${message.type === 'success' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-emerald-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari kode atau nama diskon..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2.5 cursor-pointer rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition">
          <option value="ALL">Semua Status</option>
          <option value="ACTIVE">Aktif</option>
          <option value="EXPIRED">Kadaluarsa</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse bg-white rounded-2xl border border-slate-200 p-5 h-52"></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600/70">
            <Percent className="w-6 h-6" />
          </div>
          <p className="text-slate-500 text-sm">Belum ada diskon. Buat promo pertamamu!</p>
          <Link href="/admin/diskon/add" className="inline-flex items-center justify-center gap-2 mt-4 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-60">
            <Plus className="w-4 h-4" /> Tambah Diskon
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
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
                  <tr key={d.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1">
                        <Star className="w-3 h-3 text-emerald-600" /> {d.kode_diskon}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-900">{d.nama_diskon || '-'}</td>
                    <td className="px-5 py-4 font-semibold text-red-600">-{d.persentase_diskon}%</td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                      {formatDate(d.tanggal_awal)} → {formatDate(d.tanggal_akhir)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${active ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {active ? 'AKTIF' : 'KADALUARSA'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/diskon/${d.id}`} className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => handleDelete(d.id)} className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition">
                          <Trash2 className="w-3.5 h-3.5" />
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