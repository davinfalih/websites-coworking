// app/admin/diskon/add/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Percent } from 'lucide-react';
import { createClient } from '@/lib/api';

export default function AddDiskonPage() {
  const router = useRouter();
  const client = createClient();
  const [form, setForm] = useState({
    kode_diskon: '',
    nama_diskon: '',
    persentase_diskon: '',
    tanggal_awal: '',
    tanggal_akhir: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const persentase = Number(form.persentase_diskon);
    if (!form.kode_diskon.trim() || !form.nama_diskon.trim() || !form.persentase_diskon || !form.tanggal_awal || !form.tanggal_akhir) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (isNaN(persentase) || persentase < 0 || persentase > 100) {
      setError('Persentase diskon harus antara 0-100.');
      return;
    }
    if (new Date(form.tanggal_akhir) < new Date(form.tanggal_awal)) {
      setError('Tanggal akhir tidak boleh sebelum tanggal awal.');
      return;
    }

    setSaving(true);
    try {
      const diskon = await client.createDiskon({
        kode_diskon: form.kode_diskon.trim().toUpperCase(),
        nama_diskon: form.nama_diskon.trim(),
        persentase_diskon: persentase,
        tanggal_awal: new Date(form.tanggal_awal).toISOString(),
        tanggal_akhir: new Date(form.tanggal_akhir).toISOString(),
      });
      router.push(`/admin/diskon/${diskon.id}`);
    } catch (err: any) {
      setError(err?.message || 'Gagal menambah diskon.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Manajemen Diskon</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Tambah Diskon</h1>
          <p className="mt-1 text-sm text-slate-500">Buat kode promo potongan harga baru.</p>
        </div>
        <Link href="/admin/diskon" className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium px-5 py-2.5 rounded-xl transition">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-2xl shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Kode Diskon</label>
            <input type="text" value={form.kode_diskon} onChange={(e) => setForm({ ...form, kode_diskon: e.target.value })} placeholder="Contoh: DISKON10" className={`${inputClass} uppercase font-mono`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Diskon</label>
            <input type="text" value={form.nama_diskon} onChange={(e) => setForm({ ...form, nama_diskon: e.target.value })} placeholder="Contoh: Promo Grand Opening" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Persentase Diskon (%)</label>
            <div className="relative">
              <Percent className="w-4 h-4 text-emerald-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="number" min={0} max={100} value={form.persentase_diskon} onChange={(e) => setForm({ ...form, persentase_diskon: e.target.value })} placeholder="10" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition" />
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
              {saving ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan Diskon</>}
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