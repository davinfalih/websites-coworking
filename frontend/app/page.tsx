// app/page.tsx
'use client';

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarClock,
  Clock,
  ShieldCheck,
  Wallet,
  MapPin,
  Star,
  Users,
  ArrowRight,
  CheckCircle2,
  Armchair,
  Briefcase,
  Building,
} from "lucide-react";
import type { Space } from "@/types";
import { api } from "@/lib/api";
import SpaceCard from "@/components/space/SpaceCard";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const featureIcons = {
  Space: CalendarClock,
  Pembayaran: Wallet,
  "24/7 Akses": Clock,
  Keamanan: ShieldCheck,
};

const features = [
  {
    icon: featureIcons.Space,
    title: "Multi Jenis Space",
    desc: "Personal desk, meeting room hingga private office dengan fasilitas lengkap dan nyaman untuk produktivitasmu.",
  },
  {
    icon: featureIcons.Pembayaran,
    title: "Harga Transparan",
    desc: "Harga per jam yang jelas dan diskon otomatis dari kode promo. Tanpa biaya tersembunyi, sesuai budgetmu.",
  },
  {
    icon: featureIcons["24/7 Akses"],
    title: "Booking Fleksibel",
    desc: "Reservasi cepat dalam hitungan menit, sistem anti-bentrok untuk memastikan space yang kamu pilih selalu siap.",
  },
  {
    icon: featureIcons.Keamanan,
    title: "Aman & Terpercaya",
    desc: "Verifikasi status reservasi secara real-time oleh pengelola, data pribadi terlindungi sepenuhnya.",
  },
];

const steps = [
  {
    number: "01",
    title: "Buat Akun",
    desc: "Daftar sebagai member dengan beberapa langkah sederhana. Gratis dan tanpa ribet.",
  },
  {
    number: "02",
    title: "Pilih Space",
    desc: "Jelajahi berbagai tipe space beserta harga dan kapasitasnya sesuai kebutuhanmu.",
  },
  {
    number: "03",
    title: "Reservasi",
    desc: "Tentukan tanggal, jam mulai, dan durasi. Masukkan kode diskon bila ada.",
  },
  {
    number: "04",
    title: "Pakai Space",
    desc: "Tunjukkan E-Ticket QR saat check-in. Nikmati space favoritmu!",
  },
];

const testimonials = [
  {
    name: "Andi Pratama",
    role: "Freelance Designer",
    stars: 5,
    quote:
      "Meeting room-nya selalu tersedia saat saya butuh. Booking online-nya sangat cepat dan murid klien saya senang!",
  },
  {
    name: "Sari Indah",
    role: "Startup Founder",
    stars: 5,
    quote:
      "Private office-nya nyaman untuk tim saya. Diskon promo-nya juga sangat membantu biaya operasional.",
  },
  {
    name: "Rizky Hidayat",
    role: "Mahasiswa",
    stars: 4,
    quote:
      "Personal desk dengan harga bersahabat, cocok buat yang butuh tempat fokus mengerjakan tugas.",
  },
];

export default function Home() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [spacesLoading, setSpacesLoading] = useState(true);

  useEffect(() => {
    api
      .getSpaces()
      .then((data) => setSpaces(data || []))
      .catch(() => setSpaces([]))
      .finally(() => setSpacesLoading(false));
  }, []);

  const featured = useMemo(() => spaces.slice(0, 6), [spaces]);

  return (
    <main className="bg-slate-50 min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-emerald-50 to-white">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(15,118,110,0.08) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-teal-600/10 blur-[120px]" />
          <div className="absolute top-24 right-16 hidden lg:block opacity-20">
            <svg width="380" height="380" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" stroke="currentColor" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="absolute bottom-24 left-10 hidden lg:block opacity-15" style={{ transform: "rotate(-8deg)" }}>
            <svg width="160" height="160" viewBox="0 0 24 24" fill="none" className="text-emerald-700">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" stroke="currentColor" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-16 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.05] max-w-4xl mx-auto mb-6">
            Reservasi{" "}
            <span className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Coworking Space
            </span>{" "}
            yang Mudah & Cepat
          </h1>

          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto mb-3">
            Personal desk, meeting room, hingga private office dalam satu platform
            booking online yang fleksibel.
          </p>

          <TextGenerateEffect words="Booking Sekarang, Fokus Kerja Selanjutnya!" className="mb-10 text-emerald-800" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/spaces"
              className="group inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-700/20"
            >
              <CalendarClock className="w-5 h-5" />
              Jelajahi Space
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sign-up"
              className="border border-slate-200 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-sm"
            >
              Daftar Sekarang
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { value: "3", label: "Tipe Space" },
              { value: "10%", label: "Diskon Member" },
              { value: "24/7", label: "Dukungan" },
            ].map((s, i) => (
              <div key={s.label} className="relative">
                {i < 2 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-emerald-600/20 hidden md:block" />
                )}
                <p className="text-2xl md:text-3xl font-bold text-emerald-700 tracking-tight">{s.value}</p>
                <p className="text-[10px] md:text-xs text-slate-500 tracking-wider uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPACES */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-emerald-600/40" />
              <span className="text-emerald-700 text-xs font-bold tracking-[0.25em] uppercase">Pilihan Kami</span>
              <div className="w-12 h-px bg-emerald-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">Space Unggulan Kami</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
              Temukan space yang paling cocok untuk kebutuhan kerja, rapat, maupun kolaborasi tim.
            </p>
          </div>

          {spacesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-full bg-slate-200 animate-pulse rounded-2xl aspect-[3/4]" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {featured.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 text-sm py-12">
              Space belum tersedia saat ini. Silakan cek kembali nanti.
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/spaces"
              className="inline-flex items-center gap-2 text-emerald-700 font-semibold hover:gap-3 transition-all"
            >
              Lihat Semua Space <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-emerald-600/40" />
              <span className="text-emerald-700 text-xs font-bold tracking-[0.25em] uppercase">Kenapa Kami?</span>
              <div className="w-12 h-px bg-emerald-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">Layanan Terbaik untuk Produktivitas</h2>
            <div className="flex items-center justify-center gap-3 my-2">
              <div className="flex-1 max-w-[140px] h-px bg-gradient-to-r from-transparent to-emerald-600/40" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-700 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" d="M12 2l1.9 5.6L19.5 9l-4.9 3.2L16 18l-4-2.8L8 18l1.4-5.8L4.5 9l5.6-1.4L12 2z" />
              </svg>
              <div className="flex-1 max-w-[140px] h-px bg-gradient-to-l from-transparent to-emerald-600/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO BOOK */}
      <section id="cara-booking" className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-emerald-600/40" />
              <span className="text-emerald-700 text-xs font-bold tracking-[0.25em] uppercase">Panduan</span>
              <div className="w-12 h-px bg-emerald-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">Cara Booking Space</h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
              Ikuti 4 langkah mudah berikut untuk reservasi space impianmu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative p-6 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-all duration-300">
                <span className="text-5xl font-bold text-emerald-100">{step.number}</span>
                <h3 className="font-bold text-slate-900 text-lg mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-emerald-600/30" />
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 p-8 md:p-10 shadow-xl">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%23ffffff' stroke-width='1' fill='none' d='M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4'/%3E%3C/svg%3E")`,
                  backgroundSize: "30px 30px",
                }}
              />
              <div className="relative flex items-center gap-2 text-emerald-100 italic mb-8 text-lg">
                <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                Coworking Space Nusantara
              </div>
              <div className="space-y-5 relative">
                {[
                  "Personal desk 24 jam dengan WiFi kencang",
                  "Meeting room kapasitas hingga 8 orang lengkap dengan proyektor",
                  "Private office untuk tim yang butuh ruang kerja khusus",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-emerald-100/80 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-emerald-400">500+</p>
                  <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider mt-1">Reservasi</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">3</p>
                  <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider mt-1">Tipe Space</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">100%</p>
                  <p className="text-[10px] text-emerald-100/50 uppercase tracking-wider mt-1">Kepuasan</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-emerald-600/40" />
              <span className="text-emerald-700 text-xs font-bold tracking-[0.25em] uppercase">Tentang Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-5 leading-tight">
              Ruang Kerja Fleksibel untuk Setiap Langkah Produktivitasmu
            </h2>
            <p className="text-slate-500 leading-relaxed mb-4">
              Nexus menyediakan coworking space berkualitas dengan sistem reservasi online yang transparan.
              Hadir dengan nuansa khas Indonesia, ruang kami dirancang untuk menunjang fokus, kolaborasi, dan inspirasi.
            </p>
            <p className="text-slate-500 leading-relaxed mb-8">
              Teknologi anti-bentrok memastikan setiap booking akurat. Kelola tagihan, lihat status, dan ambil e-ticket
              — semua dari satu aplikasi.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { icon: Armchair, label: "Fasilitas Lengkap", desc: "WiFi cepat & pantry" },
                { icon: Users, label: "Komunitas Aktif", desc: "Networking & event" },
                { icon: Briefcase, label: "Meeting Room", desc: "Kapasitas hingga 8" },
                { icon: Building, label: "Private Office", desc: "Ruang khusus tim" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{f.label}</p>
                    <p className="text-xs text-slate-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-700/20"
            >
              Bergabung Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-emerald-400/40" />
              <span className="text-emerald-300 text-xs font-bold tracking-[0.25em] uppercase">Testimoni</span>
              <div className="w-12 h-px bg-emerald-400/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">Kata Mereka Tentang Kami</h2>
            <div className="flex items-center justify-center gap-3 my-2">
              <div className="flex-1 max-w-[140px] h-px bg-gradient-to-r from-transparent to-emerald-400/40" />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-400 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" d="M12 2l1.9 5.6L19.5 9l-4.9 3.2L16 18l-4-2.8L8 18l1.4-5.8L4.5 9l5.6-1.4L12 2z" />
              </svg>
              <div className="flex-1 max-w-[140px] h-px bg-gradient-to-l from-transparent to-emerald-400/40" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed italic mb-6">“{t.quote}”</p>
                <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="kontak" className="bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 pt-16 md:pt-24 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-8 md:p-14 text-center shadow-xl">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%23ffffff' stroke-width='1' fill='none' d='M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4'/%3E%3C/svg%3E")`,
                backgroundSize: "30px 30px",
              }}
            />
            <div className="relative">
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-3 max-w-3xl mx-auto">
                Siap Meningkatkan Produktivitasmu Hari Ini?
              </h2>
              <p className="text-emerald-100/80 mb-8 max-w-xl mx-auto">
                Daftar sekarang dan nikmati pengalaman booking coworking space paling mudah.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/sign-up"
                  className="bg-white text-emerald-800 font-semibold px-8 py-3.5 rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-lg"
                >
                  Daftar Member
                </Link>
                <Link
                  href="/spaces"
                  className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Lihat Space
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-10 text-xs text-emerald-100/70">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Jl. Nusantara No. 1, Jakarta
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Buka 24 Jam
                </span>
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5" /> Bayar di Tempat
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight mb-3">Nexus</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Platform reservasi coworking space dengan nuansa khas Indonesia.
              </p>
            </div>
            <div>
              <h4 className="text-emerald-400 text-sm font-semibold mb-3">Navigasi</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-emerald-400">Beranda</Link></li>
                <li><Link href="/spaces" className="hover:text-emerald-400">Space</Link></li>
                <li><Link href="/#cara-booking" className="hover:text-emerald-400">Cara Booking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-emerald-400 text-sm font-semibold mb-3">Tipe Space</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/spaces?tipe=DESK" className="hover:text-emerald-400">Personal Desk</Link></li>
                <li><Link href="/spaces?tipe=MEETING_ROOM" className="hover:text-emerald-400">Meeting Room</Link></li>
                <li><Link href="/spaces?tipe=PRIVATE_OFFICE" className="hover:text-emerald-400">Private Office</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-emerald-400 text-sm font-semibold mb-3">Akun</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/sign-in" className="hover:text-emerald-400">Masuk</Link></li>
                <li><Link href="/sign-up" className="hover:text-emerald-400">Daftar</Link></li>
                <li><Link href="/dashboard" className="hover:text-emerald-400">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Nexus. Semua hak dilindungi.
            </p>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-12 h-px bg-emerald-600/40" />
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-emerald-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" d="M12 2l1.9 5.6L19.5 9l-4.9 3.2L16 18l-4-2.8L8 18l1.4-5.8L4.5 9l5.6-1.4L12 2z" />
              </svg>
              <div className="w-12 h-px bg-emerald-600/40" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}