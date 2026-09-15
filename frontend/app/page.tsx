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
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BatikBorder } from "@/components/ui/BatikBorder";
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
    <main className="bg-[#faf6f0] min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-[#1a0f08]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(196,148,74,0.06) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a0f08]/40 to-[#faf6f0]" />
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[120px]" />
          <div className="absolute top-20 right-16 hidden lg:block">
            <svg width="380" height="380" viewBox="0 0 16 16" fill="none" className="text-amber-600/10 rotate-12">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-20 left-10 hidden lg:block opacity-40" style={{ transform: "rotate(-8deg)" }}>
            <svg width="160" height="160" viewBox="0 0 16 16" fill="none" className="text-amber-600/10">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-10 pt-10 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-600/30 bg-amber-600/10 text-amber-300 text-xs font-medium tracking-wide mb-6 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Coworking Space Terbaik untuk Produktivitasmu
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] max-w-4xl mx-auto mb-6">
            Reservasi{" "}
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Coworking Space
            </span>{" "}
            yang Mudah & Cepat
          </h1>

          <p className="text-base md:text-lg text-amber-100/60 max-w-2xl mx-auto mb-3">
            Personal desk, meeting room, hingga private office dalam satu platform
            booking online yang fleksibel.
          </p>

          <TextGenerateEffect words="Booking Sekarang, Fokus Kerja Selanjutnya!" className="mb-10" />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/customer/spaces"
              className="group flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/40"
            >
              <CalendarClock className="w-5 h-5" />
              Jelajahi Space
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sign-up"
              className="border border-amber-600/40 text-amber-300 hover:bg-amber-600/10 font-semibold px-8 py-3.5 rounded-xl transition-all duration-300"
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
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-8 bg-amber-600/20 hidden md:block" />
                )}
                <p className="text-2xl md:text-3xl font-serif font-bold text-amber-400">{s.value}</p>
                <p className="text-[10px] md:text-xs text-amber-100/50 tracking-wider uppercase mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPACES */}
      <section className="py-16 md:py-24 bg-[#faf6f0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <SectionHeading
            label="Pilihan Kami"
            title="Space Unggulan Kami"
            subtitle="Temukan space yang paling cocok untuk kebutuhan kerja, rapat, maupun kolaborasi tim."
          />

          {spacesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 justify-items-center">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-40 md:w-52 bg-gray-200 animate-pulse rounded-xl aspect-[3/4]" />
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 justify-items-center">
              {featured.map((space) => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-sm py-12">
              Space belum tersedia saat ini. Silakan cek kembali nanti.
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/customer/spaces"
              className="inline-flex items-center gap-2 text-amber-700 font-semibold hover:gap-3 transition-all"
            >
              Lihat Semua Space <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#1a0f08] to-[#140d06]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase">Kenapa Kami?</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">Layanan Terbaik untuk Produktivitas</h2>
            <BatikBorder />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-xl border border-amber-800/30 bg-[#1c1008] hover:border-amber-600/50 hover:bg-[#20130a] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-amber-600/15 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-amber-100 font-serif text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-amber-100/50 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO BOOK */}
      <section id="cara-booking" className="py-16 md:py-24 bg-[#faf6f0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <SectionHeading
            label="Panduan"
            title="Cara Booking Space"
            subtitle="Ikuti 4 langkah mudah berikut untuk reservasi space impianmu."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative p-6 rounded-xl border border-amber-200 bg-white hover:shadow-lg hover:shadow-amber-900/8 transition-all duration-300">
                <span className="font-serif text-5xl font-bold text-amber-100 bg-clip-text">{step.number}</span>
                <h3 className="font-serif font-bold text-[#1a120b] text-lg mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="tentang" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-amber-600/30" />
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-900 via-[#1a0f08] to-[#1a0f08] p-8 md:p-10">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                  backgroundSize: "30px 30px",
                }}
              />
              <div className="relative flex items-center gap-2 text-amber-300 font-serif italic mb-8 text-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                Coworking Space Nusantara
              </div>
              <div className="space-y-5 relative">
                {[
                  "Personal desk 24 jam dengan WiFi kencang",
                  "Meeting room kapasitas hingga 8 orang lengkap dengan proyektor",
                  "Private office untuk tim yang butuh ruang kerja khusus",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-amber-100/80 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-6">
                <div>
                  <p className="text-2xl font-serif font-bold text-amber-400">500+</p>
                  <p className="text-[10px] text-amber-100/50 uppercase tracking-wider mt-1">Reservasi</p>
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-amber-400">3</p>
                  <p className="text-[10px] text-amber-100/50 uppercase tracking-wider mt-1">Tipe Space</p>
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-amber-400">100%</p>
                  <p className="text-[10px] text-amber-100/50 uppercase tracking-wider mt-1">Kepuasan</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">Tentang Kami</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1a120b] mb-5 leading-tight">
              Ruang Kerja Fleksibel untuk Setiap Langkah Produktivitasmu
            </h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Smart Space Booking menyediakan coworking space berkualitas dengan sistem reservasi online yang transparan.
              Hadir dengan nuansa khas Indonesia, ruang kami dirancang untuk menunjang fokus, kolaborasi, dan inspirasi.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
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
                <div key={f.label} className="flex items-center gap-3 p-3 rounded-lg border border-amber-100 bg-[#faf6f0]">
                  <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-700 shrink-0">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a120b]">{f.label}</p>
                    <p className="text-xs text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/20"
            >
              Bergabung Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#1a0f08] to-[#140d06]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-px bg-amber-600/40" />
              <span className="text-amber-400 text-xs font-bold tracking-[0.25em] uppercase">Testimoni</span>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">Kata Mereka Tentang Kami</h2>
            <BatikBorder />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-6 rounded-xl border border-amber-800/30 bg-[#1c1008] hover:border-amber-600/40 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-amber-100/70 text-sm leading-relaxed italic mb-6">“{t.quote}”</p>
                <div className="flex items-center gap-3 border-t border-amber-800/20 pt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-amber-100">{t.name}</p>
                    <p className="text-xs text-amber-100/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT / CTA */}
      <section id="kontak" className="bg-[#faf6f0]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 pt-16 md:pt-24 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 p-8 md:p-14 text-center">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23fff'/%3E%3C/svg%3E")`,
                backgroundSize: "30px 30px",
              }}
            />
            <div className="relative">
              <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-3 max-w-3xl mx-auto">
                Siap Meningkatkan Produktivitasmu Hari Ini?
              </h2>
              <p className="text-amber-100/80 mb-8 max-w-xl mx-auto">
                Daftar sekarang dan nikmati pengalaman booking coworking space paling mudah.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/sign-up"
                  className="bg-white text-amber-800 font-semibold px-8 py-3.5 rounded-xl hover:bg-amber-50 transition-all duration-300 shadow-lg"
                >
                  Daftar Member
                </Link>
                <Link
                  href="/customer/spaces"
                  className="border border-white/40 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300"
                >
                  Lihat Space
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-10 text-xs text-amber-100/70">
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
      <footer className="bg-[#140d06] border-t border-amber-800/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-serif text-lg text-white mb-3">Smart Space Booking</h3>
              <p className="text-sm text-amber-100/40 leading-relaxed">
                Platform reservasi coworking space dengan nuansa khas Indonesia.
              </p>
            </div>
            <div>
              <h4 className="text-amber-300 text-sm font-semibold mb-3">Navigasi</h4>
              <ul className="space-y-2 text-sm text-amber-100/40">
                <li><Link href="/" className="hover:text-amber-300">Beranda</Link></li>
                <li><Link href="/customer/spaces" className="hover:text-amber-300">Space</Link></li>
                <li><Link href="/#cara-booking" className="hover:text-amber-300">Cara Booking</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-amber-300 text-sm font-semibold mb-3">Tipe Space</h4>
              <ul className="space-y-2 text-sm text-amber-100/40">
                <li><Link href="/customer/spaces?tipe=DESK" className="hover:text-amber-300">Personal Desk</Link></li>
                <li><Link href="/customer/spaces?tipe=MEETING_ROOM" className="hover:text-amber-300">Meeting Room</Link></li>
                <li><Link href="/customer/spaces?tipe=PRIVATE_OFFICE" className="hover:text-amber-300">Private Office</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-amber-300 text-sm font-semibold mb-3">Akun</h4>
              <ul className="space-y-2 text-sm text-amber-100/40">
                <li><Link href="/sign-in" className="hover:text-amber-300">Masuk</Link></li>
                <li><Link href="/sign-up" className="hover:text-amber-300">Daftar</Link></li>
                <li><Link href="/dashboard" className="hover:text-amber-300">Dashboard</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-800/20 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-amber-100/30">
              © {new Date().getFullYear()} Smart Space Booking. Semua hak dilindungi.
            </p>
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-12 h-px bg-amber-600/40" />
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-amber-600/60">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="w-12 h-px bg-amber-600/40" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}