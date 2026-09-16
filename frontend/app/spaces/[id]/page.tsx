// app/spaces/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Building2,
  Lock,
  Sparkles,
  Armchair,
  Wifi,
  Coffee,
  Sun,
  CalendarClock,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { api, SPACE_TYPE_LABEL, formatRupiah } from '@/lib/api';
import type { Space } from '@/types';
import Navbar from '@/components/navbar/Navbar';

export default function PublicSpaceDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authState, setAuthState] = useState<'guest' | 'member' | 'admin' | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getSpaceById(id)
      .then(setSpace)
      .catch((e: any) => setError(e?.message || 'Space tidak ditemukan.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      if (!token || !userData) {
        setAuthState('guest');
        return;
      }
      const parsed = JSON.parse(userData);
      setAuthState(parsed.role === 'ADMIN_SPACE' ? 'admin' : 'member');
    } catch {
      setAuthState('guest');
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6 animate-pulse">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="h-64 bg-slate-100" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-slate-100 rounded w-2/3" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-4 bg-slate-100 rounded w-full" />
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm mb-6">{error}</p>
            <Link href="/spaces" className="text-emerald-700 font-semibold text-sm hover:underline">
              Kembali ke daftar
            </Link>
          </div>
        ) : space ? (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Link
                href="/spaces"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-emerald-700 transition group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Kembali ke Katalog
              </Link>
              <span className="text-slate-300">/</span>
              <span className="text-xs text-slate-800 font-medium">{space.nama_space}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-8">
              {/* LEFT: Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm">
                  <div className="relative aspect-[16/9] bg-slate-100">
                    {space.foto ? (
                      <img src={space.foto} alt={space.nama_space} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <Building2 className="w-14 h-14 text-slate-300" />
                        <span className="mt-3 text-xs uppercase tracking-widest text-slate-400 font-semibold">
                          {SPACE_TYPE_LABEL[space.tipe] || space.tipe}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600 text-white shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        Tersedia
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-sm text-white">
                        {SPACE_TYPE_LABEL[space.tipe] || space.tipe}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{space.nama_space}</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-700" />
                        {space.owner?.nama_coworking || 'Coworking Space'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-700" />
                        Kapasitas {space.kapasitas} orang
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { icon: Wifi, label: 'WiFi Kencang' },
                        { icon: Coffee, label: 'Pantry & Kopi' },
                        { icon: Armchair, label: 'Kursi Ergonomis' },
                        { icon: Sun, label: 'Pencahayaan Alami' },
                      ].map((f) => (
                        <div key={f.label} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-200 bg-slate-50">
                          <f.icon className="w-5 h-5 text-emerald-700" />
                          <span className="text-[10px] text-slate-500 text-center">{f.label}</span>
                        </div>
                      ))}
                    </div>

                    {space.deskripsi && (
                      <div className="mt-6">
                        <h3 className="font-bold text-slate-900 mb-2 text-sm">Deskripsi &amp; Fasilitas</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{space.deskripsi}</p>
                      </div>
                    )}

                    {space.diskon && (
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        Promo aktif: {space.diskon.nama_diskon || space.diskon.kode_diskon} ({space.diskon.persentase_diskon}%)
                        <span className="font-mono font-bold bg-emerald-100 px-1.5 py-0.5 rounded-md">{space.diskon.kode_diskon}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: Price + Auth Gate */}
              <div className="lg:sticky lg:top-6 h-fit">
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-emerald-700 px-6 py-4">
                    <div className="flex items-baseline justify-between">
                      <h2 className="text-lg font-bold text-white">Reservasi Space</h2>
                      <span className="text-emerald-200/80 text-xs">{SPACE_TYPE_LABEL[space.tipe] || space.tipe}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-white font-mono">{formatRupiah(space.harga_per_jam)}</span>
                      <span className="text-emerald-100/70 text-xs ml-1">/ jam</span>
                    </div>
                  </div>

                  <div className="p-6">
                    {authState === null ? (
                      <div className="space-y-3">
                        <div className="h-36 bg-slate-100 animate-pulse rounded-xl" />
                      </div>
                    ) : authState === 'member' ? (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                          <CalendarClock className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                          Kamu sudah masuk sebagai member. Lanjutkan untuk memilih tanggal, jam, dan membuat reservasi.
                        </p>
                        <button
                          onClick={() => router.push(`/customer/spaces/${space.id}`)}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-all shadow-sm"
                        >
                          <CalendarClock className="w-4 h-4" />
                          Lanjutkan ke Booking
                        </button>
                        <p className="text-[10px] text-slate-400 text-center">
                          Reservasi akan ditinjau oleh pengelola sebelum terkonfirmasi.
                        </p>
                      </div>
                    ) : authState === 'admin' ? (
                      <div className="space-y-4">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          Anda masuk sebagai pengelola space. Buka dashboard untuk mengelola ketersediaan dan reservasi.
                        </p>
                        <button
                          onClick={() => router.push('/admin/spaces')}
                          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-all"
                        >
                          <Building2 className="w-4 h-4" />
                          Buka Dashboard Admin
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
                          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Login untuk Reservasi</p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                              Ruang ini bisa dilihat siapa saja. Untuk membuat reservasi, masuk atau daftar akun member dulu.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => router.push(`/sign-in?redirect=/spaces/${space.id}`)}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-all shadow-sm"
                        >
                          <LogIn className="w-4 h-4" />
                          Masuk untuk Reservasi
                        </button>
                        <button
                          onClick={() => router.push(`/sign-up?redirect=/spaces/${space.id}`)}
                          className="w-full flex items-center justify-center gap-2 border border-slate-300 bg-white hover:bg-emerald-50 text-emerald-700 font-semibold py-3 rounded-lg transition-all"
                        >
                          <UserPlus className="w-4 h-4" />
                          Daftar Sebagai Member
                        </button>
                        <p className="text-[10px] text-slate-400 text-center">
                          Gratis & tidak butuh kartu. Daftar kurang dari 1 menit.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}