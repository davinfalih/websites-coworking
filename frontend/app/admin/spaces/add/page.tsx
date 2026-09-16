// app/admin/spaces/add/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Upload, Building2, Trash2, ImageOff } from 'lucide-react';
import { createClient, SPACE_TYPE_LABEL } from '@/lib/api';

const uploadToFe = async (file: File): Promise<string> => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Gagal mengunggah foto');
  return data.data.url;
};

export default function AddSpacePage() {
  const router = useRouter();
  const client = createClient();
  const [form, setForm] = useState({
    nama_space: '',
    tipe: 'DESK' as 'DESK' | 'MEETING_ROOM' | 'PRIVATE_OFFICE',
    harga_per_jam: '',
    kapasitas: '',
    deskripsi: '',
    foto: '',
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadToFe(file);
      setForm((f) => ({ ...f, foto: url }));
      setPreview(url);
    } catch (err: any) {
      setError(err?.message || 'Gagal mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const harga = Number(form.harga_per_jam);
    const kapasitas = Number(form.kapasitas);

    if (!form.nama_space.trim() || !form.harga_per_jam || !form.kapasitas) {
      setError('Nama space, harga, dan kapasitas wajib diisi.');
      return;
    }
    if (isNaN(harga) || harga < 0 || isNaN(kapasitas) || kapasitas < 1) {
      setError('Harga dan kapasitas tidak valid.');
      return;
    }

    setSaving(true);
    try {
      const space = await client.createSpace({
        nama_space: form.nama_space.trim(),
        tipe: form.tipe,
        harga_per_jam: harga,
        kapasitas,
        deskripsi: form.deskripsi.trim() || undefined,
        foto: form.foto || undefined,
      });
      router.push(`/admin/spaces/${space.id}`);
    } catch (err: any) {
      setError(err?.message || 'Gagal menambah space.');
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
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Manajemen Ruang</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Tambah Space Baru</h1>
          <p className="mt-1 text-sm text-slate-500">Lengkapi detail space yang akan disewakan.</p>
        </div>
        <Link href="/admin/spaces" className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium px-5 py-2.5 rounded-xl transition">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
        {/* Foto */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" /> Foto Space
          </h2>
          <div className="rounded-xl overflow-hidden border-2 border-dashed border-slate-200 bg-slate-50 aspect-square flex items-center justify-center relative">
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setForm((f) => ({ ...f, foto: '' }));
                    setPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-lg hover:bg-black/80 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="text-center px-6">
                <ImageOff className="w-10 h-10 text-emerald-600/30 mx-auto mb-3" />
                <p className="text-xs text-slate-400">Belum ada foto. Unggah foto space (opsional).</p>
              </div>
            )}
          </div>
          <label className="mt-4 w-full flex items-center justify-center gap-2 border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 text-sm font-medium py-3 rounded-xl cursor-pointer transition">
            <Upload className="w-4 h-4" />
            {uploading ? 'Mengunggah...' : preview ? 'Ganti Foto' : 'Unggah Foto'}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
          <p className="text-[11px] text-slate-400 mt-2 text-center">PNG, JPG, atau WEBP. Maks 5MB.</p>
        </div>

        {/* Detail */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-700" /> Detail Space
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Space</label>
              <input type="text" value={form.nama_space} onChange={(e) => setForm({ ...form, nama_space: e.target.value })} placeholder="Contoh: Personal Desk 02" className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipe Space</label>
                <select
                  value={form.tipe}
                  onChange={(e) => setForm({ ...form, tipe: e.target.value as any })}
                  className={inputClass}
                >
                  {Object.entries(SPACE_TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kapasitas (orang)</label>
                <input type="number" min={1} value={form.kapasitas} onChange={(e) => setForm({ ...form, kapasitas: e.target.value })} placeholder="1" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Harga Sewa per Jam (Rp)</label>
              <input type="number" min={0} value={form.harga_per_jam} onChange={(e) => setForm({ ...form, harga_per_jam: e.target.value })} placeholder="15000" className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi Fasilitas</label>
              <textarea
                value={form.deskripsi}
                onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                rows={4}
                placeholder="Contoh: Meja kerja dengan kursi ergonomis & stop kontak..."
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving || uploading} className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition disabled:opacity-60">
                {saving ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan Space</>}
              </button>
              <Link href="/admin/spaces" className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium px-6 py-3 rounded-xl transition">
                Batal
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}