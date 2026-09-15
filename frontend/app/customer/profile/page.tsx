// app/customer/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Pencil, Save, X, Briefcase, User as UserIcon, Phone, ArrowLeft, Building2 } from 'lucide-react';
import { createClient } from '@/lib/api';
import type { Member } from '@/types';

export default function CustomerProfilePage() {
  const client = createClient();
  const [profile, setProfile] = useState<Member | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nama_member: '', instansi: '', telp: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await client.getMyMemberProfile();
      setProfile(res);
      setForm({
        nama_member: res.nama_member,
        instansi: res.instansi || '',
        telp: res.telp || '',
      });
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'Gagal memuat profil.' });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await client.updateMyMemberProfile(form);
      setProfile(res);
      setEditing(false);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Gagal memperbarui profil.' });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-[#1a120b] text-sm';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#1a120b]">Profil Saya</h1>
        <p className="text-sm text-gray-500 mt-1">Kelola informasi akun member-mu.</p>
      </div>

      {message && (
        <div className={`text-sm px-4 py-3 rounded-xl border ${message.type === 'success' ? 'text-green-700 bg-green-50 border-green-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
          {message.text}
        </div>
      )}

      {profile && !editing && (
        <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden">
          <div className="relative h-28 bg-gradient-to-br from-amber-700 via-amber-600 to-amber-500">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23fff'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
              }}
            />
            <div className="absolute -bottom-10 left-8 w-20 h-20 rounded-2xl bg-white border border-amber-100 shadow-lg flex items-center justify-center">
              <span className="text-3xl font-serif font-bold text-amber-700">{profile.nama_member.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div className="pt-14 px-8 pb-8">
            <div className="flex justify-end">
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition">
                <Pencil className="w-4 h-4" /> Ubah Profil
              </button>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1a120b] mb-1">{profile.nama_member}</h2>
            <p className="text-sm text-amber-700 mb-6">Member</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-xl border border-amber-100 bg-[#faf6f0]">
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><UserIcon className="w-3.5 h-3.5 text-amber-600/60" /> Nama Lengkap</p>
                <p className="text-sm font-medium text-[#1a120b]">{profile.nama_member}</p>
              </div>
              <div className="p-4 rounded-xl border border-amber-100 bg-[#faf6f0]">
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Briefcase className="w-3.5 h-3.5 text-amber-600/60" /> Instansi</p>
                <p className="text-sm font-medium text-[#1a120b]">{profile.instansi || '-'}</p>
              </div>
              <div className="p-4 rounded-xl border border-amber-100 bg-[#faf6f0]">
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Phone className="w-3.5 h-3.5 text-amber-600/60" /> No. Telepon</p>
                <p className="text-sm font-medium text-[#1a120b]">{profile.telp || '-'}</p>
              </div>
              <div className="p-4 rounded-xl border border-amber-100 bg-[#faf6f0]">
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Building2 className="w-3.5 h-3.5 text-amber-600/60" /> Alamat</p>
                <p className="text-sm font-medium text-[#1a120b]">{profile.alamat || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="bg-white rounded-2xl border border-amber-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-serif font-bold text-[#1a120b]">Ubah Profil</h2>
            <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm">
              <X className="w-4 h-4" /> Batal
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Lengkap</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" value={form.nama_member} onChange={(e) => setForm({ ...form, nama_member: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">Instansi</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" value={form.instansi} onChange={(e) => setForm({ ...form, instansi: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">No. Telepon</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="tel" value={form.telp} onChange={(e) => setForm({ ...form, telp: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition disabled:opacity-60">
                {saving ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan</>}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="flex items-center gap-2 border border-amber-200 text-gray-600 hover:bg-[#faf6f0] text-sm font-medium px-6 py-3 rounded-xl transition">
                <ArrowLeft className="w-4 h-4" /> Kembali
              </button>
            </div>
          </form>
        </div>
      )}

      {!profile && !editing && (
        <div className="bg-white rounded-2xl border border-amber-100 p-10 text-center text-gray-400 text-sm">
          Memuat profil...
        </div>
      )}
    </div>
  );
}