// app/admin/diskon/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Save, ArrowLeft, Percent } from 'lucide-react';
import { createClient } from '@/lib/api';
import type { Diskon } from '@/types';

const toDateInput = (d?: string) => {
  if (!d) return '';
  const date = new Date(d);
  if (isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function EditDiskonPage() {
  const params = useParams<{ id: string }>();
  const client = createClient();
  const id = Number(params.id);

  const [item, setItem] = useState<Diskon | null>(null);
  const [form, setForm] = useState({ kode_diskon: '', nama_diskon: '', persentase_diskon: '', tanggal_awal: '', tanggal_akhir: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    client
      .getDiskon()
      .then((list) => {
        const found = list.find((d) => d.id === id);
        if (!found) {
          setError('Diskon tidak ditemukan.');
          return;
        }
        setItem(found);
        setForm({
          kode_diskon: found.kode_diskon,
          nama_diskon: found.nama_diskon || '',
          persentase_diskon: String(found.persentase_diskon),
          tanggal_awal: toDateInput(found.tanggal_awal),
          tanggal_akhir: toDateInput(found.tanggal_akhir),
        });
      })
      .catch((err: any) => setError(err?.message || 'Gagal mengambil data diskon.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const persentase = Number(form.persentase_diskon);
    if (!form.kode_diskon.trim() || !form.nama_diskon.trim() || !form.persentase_diskon || !form.tanggal_awal || !form.tanggal_akhir) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (isNaN(persentase) || persentase < 0 || persentase > 100) {
      setError('Persentase diskon harus antara 0-100.');
      return;
    }

    setSaving(true);
    try {
      const updated = await client.updateDiskon(id, {
        kode_diskon: form.kode_diskon.trim().toUpperCase(),
        nama_diskon: form.nama_diskon.trim(),
        persentase_diskon: persentase,
        tanggal_awal: new Date(form.tanggal_awal).toISOString(),
        tanggal_akhir: new Date(form.tanggal_akhir).toISOString(),
      });
      setItem(updated);
      setSuccess('Diskon berhasil diperbarui.');
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui diskon.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition';

  if (loading) {
    return <div className="animate-pulse bg-white rounded-2xl border border-slate-200 p-5 h-52"></div>;
  }

  if (!item) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-slate-500">Diskon tidak ditemukan.</p>
        <Link href="/admin/diskon" className="inline-flex items-center gap-2 mt-4 text-emerald-700 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Kembali ke daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Manajemen Diskon</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Ubah Diskon</h1>
          <p className="mt-1 text-sm text-slate-500">{item.kode_diskon}</p>
        </div>
        <Link href="/admin/diskon" className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium px-5 py-2.5 rounded-xl transition">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      {success && (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">{success}</div>
      )}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kode Diskon</label>
            <input type="text" value={form.kode_diskon} onChange={(e) => setForm({ ...form, kode_diskon: e.target.value })} className={`${inputClass} uppercase font-mono`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Diskon</label>
            <input type="text" value={form.nama_diskon} onChange={(e) => setForm({ ...form, nama_diskon: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Persentase Diskon (%)</label>
            <div className="relative">
              <Percent className="w-4 h-4 text-emerald-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="number" min={0} max={100} value={form.persentase_diskon} onChange={(e) => setForm({ ...form, persentase_diskon: e.target.value })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Awal</label>
              <input type="date" value={form.tanggal_awal} onChange={(e) => setForm({ ...form, tanggal_awal: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Akhir</label>
              <input type="date" value={form.tanggal_akhir} onChange={(e) => setForm({ ...form, tanggal_akhir: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition disabled:opacity-60">
              {saving ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
            </button>
            <Link href="/admin/diskon" className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium px-6 py-3 rounded-xl transition">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}