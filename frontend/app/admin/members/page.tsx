// app/admin/members/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Search, Trash2, Users, Briefcase, Phone } from 'lucide-react';
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
          <h1 className="text-2xl font-serif font-bold text-[#1a120b]">Daftar Member</h1>
          <p className="text-sm text-gray-500 mt-1">Semua member yang terdaftar pada platform.</p>
        </div>
      </div>

      {message && (
        <div className={`text-sm px-4 py-3 rounded-xl border ${message.type === 'success' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
          {message.text}
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama, instansi, atau telepon..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-sm" />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center text-gray-400 text-sm">Memuat member...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-amber-600/60" />
          </div>
          <p className="text-gray-500 text-sm">Belum ada member terdaftar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-100 bg-[#faf6f0] text-left text-xs uppercase tracking-wider text-gray-500">
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
                  <tr key={m.id} className="border-b border-amber-50 hover:bg-amber-50/40 transition">
                    <td className="px-5 py-4 text-gray-400">{idx + 1}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">
                          {m.nama_member.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#1a120b]">{m.nama_member}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Briefcase className="w-3.5 h-3.5 text-amber-600/60" /> {m.instansi || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-amber-600/60" /> {m.telp || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(m.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition">
                          <Trash2 className="w-4 h-4" />
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