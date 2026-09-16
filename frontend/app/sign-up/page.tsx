'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";

export default function SignUp() {
  const router = useRouter();
  const [memberForm, setMemberForm] = useState({
    username: "",
    password: "",
    nama_member: "",
    instansi: "",
    telp: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!memberForm.username.trim() || !memberForm.password || !memberForm.nama_member.trim() || !memberForm.telp.trim()) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (memberForm.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      await api.registerMember({
        username: memberForm.username.trim(),
        password: memberForm.password,
        nama_member: memberForm.nama_member.trim(),
        instansi: memberForm.instansi.trim(),
        telp: memberForm.telp.trim(),
      });

      // Auto login
      const { access_token, user } = await api.login(memberForm.username.trim(), memberForm.password);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      window.location.href =
        redirect && redirect.startsWith("/") && user.role === "MEMBER"
          ? redirect
          : "/customer/spaces";
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-slate-900 antialiased">
      {/* LeftBrandShowcase */}
      <section className="relative hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-10 xl:p-14 overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 text-white select-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%23ffffff' stroke-width='1' fill='none' d='M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4'/%3E%3C/svg%3E")`,
            backgroundSize: "30px 30px",
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-300 shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-white">Nexus</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="text-xs uppercase tracking-widest text-emerald-200/80 font-medium">Workstation &amp; Booking</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-emerald-400/30 text-emerald-200 text-xs font-semibold mb-6 backdrop-blur-sm">
            <span>🌿 Ruang Kerja Ergonomis &amp; Tenang</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
            Ruang Kerja Tenang untuk Produktivitas Maksimal.
          </h1>
          <p className="text-emerald-100/80 text-sm xl:text-base leading-relaxed mb-8">
            Temukan suasana bekerja yang kondusif dengan fasilitas pintar terintegrasi, fleksibilitas reservasi instan, dan ekosistem profesional dinamis.
          </p>

          <ul className="space-y-4 text-sm xl:text-base">
            {[
              "Akses 24/7 High-speed Internet & Private Power-outlets",
              "Ergonomic Pods & Private Meeting Rooms",
              "Komunitas Profesional & Kreatif Terkurasi"
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-emerald-100/90">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* RightAuthRegistrationSection */}
      <section className="flex-1 min-h-screen flex items-center justify-center px-4 py-8 sm:px-8 lg:px-12 bg-white">
        <div className="w-full max-w-lg py-6">
          <div className="flex lg:hidden items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Nexus</span>
          </div>

          <div className="flex items-center justify-between mb-5">
            <Link href="/" className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-emerald-700 transition-colors group">
              <svg className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Kembali ke Beranda
            </Link>
            <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100">
              Pendaftaran Instan
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Daftar Akun Member</h2>
            <p className="text-sm text-slate-500 mt-1">
              Mulai reservasi meja kerja, private pod, dan ruang meeting dengan mudah.
            </p>
          </div>

          <form onSubmit={handleMemberSubmit} className="space-y-4">

            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                id="full-name"
                type="text"
                value={memberForm.nama_member}
                onChange={(e) => setMemberForm({ ...memberForm, nama_member: e.target.value })}
                placeholder="Budi Santoso"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="company" className="block text-sm font-medium text-slate-700">Instansi / Perusahaan</label>
                <span className="text-[11px] text-slate-400">(Opsional)</span>
              </div>
              <input
                id="company"
                type="text"
                value={memberForm.instansi}
                onChange={(e) => setMemberForm({ ...memberForm, instansi: e.target.value })}
                placeholder="PT Teknologi Maju atau Freelance"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-slate-700 mb-1.5">
                No. Telepon / WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative flex rounded-lg shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-600 text-xs font-medium select-none">
                  +62
                </span>
                <input
                  id="phone-number"
                  type="tel"
                  value={memberForm.telp}
                  onChange={(e) => setMemberForm({ ...memberForm, telp: e.target.value })}
                  placeholder="812-3456-7890"
                  required
                  className="block w-full min-w-0 flex-1 px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-r-lg text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                value={memberForm.username}
                onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })}
                placeholder="Contoh: budi123"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={memberForm.password}
                  onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth="2" /> : <Eye className="w-4 h-4" strokeWidth="2" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">Minimal 6 karakter kombinasi huruf &amp; angka</p>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="pt-2 flex items-start space-x-2.5">
              <input type="checkbox" id="terms" required className="h-4 w-4 mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-700/20 focus:ring-offset-0 transition cursor-pointer" />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-normal select-none">
                Saya telah membaca dan menyetujui <Link href="#" className="text-emerald-700 underline font-medium hover:text-emerald-800">Syarat &amp; Ketentuan</Link> serta <Link href="#" className="text-emerald-700 underline font-medium hover:text-emerald-800">Kebijakan Privasi</Link> Nexus.
              </label>
            </div>

            <div className="pt-3">
              <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-semibold px-5 py-2.5 shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  <>
                    <span>Daftar Akun Sekarang</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 uppercase tracking-wider text-[11px] font-medium">atau daftar dengan</span>
            </div>
          </div>

          <div>
            <button type="button" className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium px-5 py-2.5 shadow-sm transition">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
              </svg>
              <span>Daftar Cepat dengan Google</span>
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            Sudah punya akun? <Link href="/sign-in" className="text-emerald-700 font-semibold hover:underline ml-1">Masuk / Login di sini</Link>
          </div>
        </div>
      </section>
    </main>
  );
}