// app/admin/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Pencil, Save, X, Building2, User as UserIcon, Phone, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/api';
import type { SpaceOwner } from '@/types';

export default function AdminProfilePage() {
  const client = createClient();
  const [profile, setProfile] = useState<SpaceOwner | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nama_coworking: '', nama_pemilik: '', telp: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await client.getMyOwnerProfile();
      setProfile(res);
      setForm({
        nama_coworking: res.nama_coworking,
        nama_pemilik: res.nama_pemilik,
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
      const res = await client.updateMyOwnerProfile(form);
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
    'w-full h-10 pl-10 pr-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Identitas</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Profil Pengelola</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola identitas coworking space-mu.</p>
        </div>
      </div>

      {message && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-600'}`}>
          {message.text}
        </div>
      )}

      {profile && !editing && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <div className="relative h-32 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700">
            <div className="absolute -bottom-10 left-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-lg">
              <Building2 className="h-9 w-9 text-emerald-700" />
            </div>
          </div>
          <div className="px-8 pb-8 pt-14">
            <div className="flex justify-end">
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
              >
                <Pencil className="h-4 w-4" /> Ubah Profil
              </button>
            </div>
            <h2 className="mb-1 mt-6 text-2xl font-semibold tracking-tight text-slate-900">{profile.nama_coworking}</h2>
            <p className="mb-6 text-sm text-emerald-700">Coworking Space • Jakarta</p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-1 flex items-center gap-1 text-xs text-slate-400"><Building2 className="h-3.5 w-3.5 text-emerald-600/70" /> Nama Coworking</p>
                <p className="text-sm font-medium text-slate-900">{profile.nama_coworking}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-1 flex items-center gap-1 text-xs text-slate-400"><UserIcon className="h-3.5 w-3.5 text-emerald-600/70" /> Nama Pemilik</p>
                <p className="text-sm font-medium text-slate-900">{profile.nama_pemilik}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-1 flex items-center gap-1 text-xs text-slate-400"><Phone className="h-3.5 w-3.5 text-emerald-600/70" /> No. Telepon</p>
                <p className="text-sm font-medium text-slate-900">{profile.telp || '-'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-1 flex items-center gap-1 text-xs text-slate-400"><UserIcon className="h-3.5 w-3.5 text-emerald-600/70" /> Username</p>
                <p className="text-sm font-medium text-slate-900">@{profile.user?.username || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Ubah Profil</h2>
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" /> Batal
            </button>
          </div>
          <form onSubmit={handleSave} className="max-w-xl space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">Nama Coworking Space</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" value={form.nama_coworking} onChange={(e) => setForm({ ...form, nama_coworking: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">Nama Pemilik</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="text" value={form.nama_pemilik} onChange={(e) => setForm({ ...form, nama_pemilik: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700">No. Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="tel" value={form.telp} onChange={(e) => setForm({ ...form, telp: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600 disabled:opacity-60">
                {saving ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Menyimpan...</> : <><Save className="h-4 w-4" /> Simpan</>}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4" /> Kembali
              </button>
            </div>
          </form>
        </div>
      )}

      {!profile && !editing && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-400">
          Memuat profil...
        </div>
      )}
    </div>
  );
}