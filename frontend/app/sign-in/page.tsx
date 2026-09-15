// app/sign-in/page.tsx
'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff, User as UserIcon, MapPin, Clock, Wallet, Star } from "lucide-react";
import { api } from "@/lib/api";

const perks = [
  { icon: Star, text: "Booking space favorit dalam hitungan menit" },
  { icon: Wallet, text: "Harga transparan + diskon promo menarik" },
  { icon: Clock, text: "Status reservasi terpantau real-time" },
];

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

      window.location.href = user.role === "ADMIN_SPACE" ? "/admin/profile" : "/customer/spaces";
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#faf6f0] flex items-center justify-center relative overflow-hidden py-14">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(196,148,74,0.08) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-600/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-4 md:mx-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] bg-white rounded-3xl shadow-2xl shadow-amber-900/10 border border-amber-100 overflow-hidden">
          {/* Panel brand */}
          <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#1a0f08] via-[#20130a] to-[#1a0f08] relative">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                backgroundSize: "40px 40px",
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center">
                  <Star className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-serif text-white text-lg leading-none">Smart Space</p>
                  <p className="text-[8px] text-amber-500/70 tracking-[0.25em] uppercase mt-0.5">Coworking Space</p>
                </div>
              </div>
              <h2 className="font-serif text-3xl text-white leading-snug mb-4">
                Selamat Datang<br />Kembali!
              </h2>
              <p className="text-amber-100/50 text-sm mb-8 leading-relaxed">
                Masuk untuk melanjutkan reservasi dan kelola aktivitas coworking-mu.
              </p>
              <div className="space-y-4 mb-8">
                {perks.map((p) => (
                  <div key={p.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-600/15 flex items-center justify-center text-amber-400">
                      <p.icon className="w-4 h-4" />
                    </div>
                    <p className="text-amber-100/60 text-sm">{p.text}</p>
                  </div>
                ))}
              </div>
              <div className="text-amber-100/40 text-xs font-serif italic">
                “Tempatnya fokus, ruangnya inspirasi.”
              </div>
            </div>
            <div className="relative flex items-center gap-2 opacity-40">
              <div className="w-16 h-px bg-amber-600/50" />
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="text-amber-600">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="w-16 h-px bg-amber-600/50" />
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12">
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center">
                <Star className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <p className="font-serif text-[#1a120b] font-semibold">Smart Space Booking</p>
            </div>

            <h1 className="font-serif text-2xl font-bold text-[#1a120b] mb-1">Masuk</h1>
            <p className="text-sm text-gray-500 mb-8">Silakan masuk menggunakan akunmu.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="username"
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="Masukkan username"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-[#1a120b] text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Masukkan password"
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-[#1a120b] text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-600/50 hover:text-amber-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Masuk...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" /> Masuk
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Belum punya akun?{" "}
              <Link href="/sign-up" className="text-amber-700 font-semibold hover:text-amber-800">
                Daftar Sekarang
              </Link>
            </p>

            <div className="mt-6 border-t border-amber-100 pt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400">
              <MapPin className="w-3 h-3 text-amber-600/60" /> Jl. Nusantara No. 1, Jakarta
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}