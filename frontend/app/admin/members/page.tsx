// app/admin/members/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Search, Trash2, Users, Briefcase, Phone, UserPlus } from 'lucide-react';
import { createClient } from '@/lib/api';
import type { Member } from '@/types';

const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-');

export default function AdminMembersPage() {
  const client = createClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [filtered, setFiltered] = useState<Member[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await client.getMembers();
      setMembers(res || []);
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Gagal memuat daftar member.' });
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let list = members;
    if (search.trim()) {
      list = list.filter((m) => m.nama_member.toLowerCase().includes(search.toLowerCase()) || (m.instansi || '').toLowerCase().includes(search.toLowerCase()) || (m.telp || '').includes(search));
    }
    setFiltered(list);
  }, [members, search]);

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus member ini?')) return;
    try {
      await client.deleteMember(id);
      setMessage({ type: 'success', text: 'Member berhasil dihapus.' });
      load();
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Gagal menghapus member.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Direktori</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Daftar Member</h1>
          <p className="mt-1 text-sm text-slate-500">Semua member yang terdaftar pada platform.</p>
        </div>
      </div>

      {message && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">{members.length}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Member</p>
          <p className="mt-1 text-xs text-slate-400">Member terdaftar di platform</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600/50" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, instansi, atau telepon..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition" />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-sm text-gray-400">Memuat member...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600/60">
            <UserPlus className="h-6 w-6" />
          </div>
          <p className="text-gray-500 text-sm">Belum ada member terdaftar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3.5">#</th>
                  <th className="px-5 py-3.5">Nama Member</th>
                  <th className="px-5 py-3.5">Instansi</th>
                  <th className="px-5 py-3.5">Telepon</th>
                  <th className="px-5 py-3.5">Terdaftar</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, idx) => (
                  <tr key={m.id} className="border-b border-slate-100 transition hover:bg-slate-50">
                    <td className="px-5 py-4 text-sm text-slate-400">{idx + 1}</td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-semibold text-sm">
                          {m.nama_member.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900">{m.nama_member}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Briefcase className="h-3.5 w-3.5 text-slate-400" /> {m.instansi || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3.5 w-3.5 text-slate-400" /> {m.telp || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">{formatDate(m.createdAt)}</td>
                    <td className="px-5 py-4 text-sm">
                      <div className="flex justify-end">
                        <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}