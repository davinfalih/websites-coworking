'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { api } from "@/lib/api";
import { NexusMark } from "@/components/ui/Logo";

export default function SignIn() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.username.trim() || !form.password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const { access_token, user } = await api.login(form.username.trim(), form.password);

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      const redirect = new URLSearchParams(window.location.search).get("redirect");
      if (redirect && redirect.startsWith("/") && user.role === "MEMBER") {
        window.location.href = redirect;
      } else {
        window.location.href = user.role === "ADMIN_SPACE" ? "/admin/profile" : "/customer/spaces";
      }
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-slate-800 antialiased">
      {/* LeftBrandSidebar */}
      <section className="relative w-full lg:w-[46%] min-h-[500px] lg:min-h-screen flex flex-col justify-between p-8 lg:p-14 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Coworking Space Nusantara"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/70 to-teal-900/60" />

        <Link href="/" className="relative z-10 inline-flex items-center gap-3 w-fit">
          <NexusMark className="w-11 h-11" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xl tracking-tight">Nexus</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[10px] font-semibold text-emerald-200/80 tracking-widest uppercase">Workstation &amp; Booking</p>
          </div>
        </Link>

        <div className="relative z-10 my-10 lg:my-auto max-w-lg space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-emerald-400/30 text-emerald-200 text-xs font-medium backdrop-blur-sm">
            <span>🌿</span>
            <span>Ruang Kerja Ergonomis &amp; Tenang</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-white leading-tight tracking-tight">
            Ruang Kerja Tenang untuk Produktivitas Maksimal.
          </h1>
          <p className="text-emerald-100/85 text-sm sm:text-base leading-relaxed">
            Temukan suasana bekerja yang kondusif dengan fasilitas pintar terintegrasi, fleksibilitas reservasi instan, dan ekosistem profesional dinamis.
          </p>
        </div>
      </section>

      {/* RightLoginFormArea */}
      <main className="w-full lg:w-[54%] bg-slate-50/50 flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-y-auto">
        <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors group">
            <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Kembali ke Beranda
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-brand border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Sistem Online
          </span>
        </div>

        <div className="w-full max-w-md mx-auto my-auto py-2">
          <header className="mb-7 text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Masuk ke Akun</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Akses reservasi ruang kerja, check-in QR, atau kelola coworking space Anda.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input
                  id="identifier"
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Masukkan username"
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-brand transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Kata Sandi <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Masukkan kata sandi"
                  required
                  className="w-full pl-11 pr-11 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-brand transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" strokeWidth="1.8" /> : <Eye className="h-5 w-5" strokeWidth="1.8" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-1 pb-1">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded text-brand border-slate-300 focus:ring-emerald-500/30 focus:ring-offset-0 transition" />
                <span className="text-xs sm:text-sm text-slate-600">Ingat saya selama 30 hari</span>
              </label>
              <Link href="#" className="text-xs sm:text-sm font-medium text-brand hover:text-brand-hover hover:underline">
                Lupa Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-brand hover:bg-brand-hover text-white rounded-lg font-semibold text-sm shadow-sm transition-all duration-200 flex items-center justify-center gap-2 focus:ring-4 focus:ring-emerald-500/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Masuk...
                </>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="bg-slate-50/50 px-3 text-slate-400 font-medium">Atau masuk dengan</span>
            </div>
          </div>

          <div className="space-y-3">
            <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 shadow-sm transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-slate-200">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
              </svg>
              <span>Lanjutkan dengan Google</span>
            </button>
          </div>

          <div className="mt-8 text-center pt-2">
            <p className="text-xs sm:text-sm text-slate-600">
              Belum punya akun Member?{" "}
              <Link href="/sign-up" className="font-semibold text-brand hover:text-brand-hover hover:underline transition">
                Daftar Akun Member
              </Link>
            </p>
          </div>
        </div>

        <footer className="w-full max-w-md mx-auto text-center pt-6 text-xs text-slate-400">
          <p>© 2025 Nexus Workstation &amp; Booking. Seluruh hak cipta dilindungi.</p>
        </footer>
      </main>
    </div>
  );
}
