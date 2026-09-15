// app/sign-up/page.tsx
'use client';

import Link from "next/link";
import { useState } from "react";
import { UserPlus, Eye, EyeOff, User as UserIcon, Building2, Phone, Briefcase, Star } from "lucide-react";
import { api } from "@/lib/api";

type Role = "MEMBER" | "ADMIN_SPACE";

const initialMemberForm = {
  username: "",
  password: "",
  nama_member: "",
  instansi: "",
  telp: "",
};

const initialOwnerForm = {
  username: "",
  password: "",
  nama_coworking: "",
  nama_pemilik: "",
  telp: "",
};

export default function SignUp() {
  const [role, setRole] = useState<Role>("MEMBER");
  const [memberForm, setMemberForm] = useState(initialMemberForm);
  const [ownerForm, setOwnerForm] = useState(initialOwnerForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const switchRole = (r: Role) => {
    setRole(r);
    setError(null);
  };

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
      window.location.href = "/customer/spaces";
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!ownerForm.username.trim() || !ownerForm.password || !ownerForm.nama_coworking.trim() || !ownerForm.nama_pemilik.trim() || !ownerForm.telp.trim()) {
      setError("Semua kolom wajib diisi.");
      return;
    }
    if (ownerForm.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      await api.registerOwner({
        username: ownerForm.username.trim(),
        password: ownerForm.password,
        nama_coworking: ownerForm.nama_coworking.trim(),
        nama_pemilik: ownerForm.nama_pemilik.trim(),
        telp: ownerForm.telp.trim(),
      });

      const { access_token, user } = await api.login(ownerForm.username.trim(), ownerForm.password);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/admin/profile";
    } catch (err: any) {
      setError(err?.message || "Terjadi kesalahan. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-[#1a120b] text-sm";

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

      <div className="relative z-10 w-full max-w-lg mx-4 md:mx-6">
        <div className="bg-white rounded-3xl shadow-2xl shadow-amber-900/10 border border-amber-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 text-white mb-4 shadow-lg shadow-amber-900/30">
                <UserPlus className="w-5 h-5" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#1a120b]">Daftar Akun Baru</h1>
              <p className="text-sm text-gray-500 mt-1">Bergabung dengan Smart Space Booking</p>
            </div>

            {/* Role tabs */}
            <div className="grid grid-cols-2 gap-2 bg-[#faf6f0] border border-amber-100 rounded-2xl p-1.5 mb-7">
              <button
                type="button"
                onClick={() => switchRole("MEMBER")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  role === "MEMBER"
                    ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md shadow-amber-900/20"
                    : "text-gray-500 hover:text-amber-700"
                }`}
              >
                <UserIcon className="w-4 h-4" /> Member
              </button>
              <button
                type="button"
                onClick={() => switchRole("ADMIN_SPACE")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  role === "ADMIN_SPACE"
                    ? "bg-gradient-to-r from-amber-700 to-amber-600 text-white shadow-md shadow-amber-900/20"
                    : "text-gray-500 hover:text-amber-700"
                }`}
              >
                <Building2 className="w-4 h-4" /> Pengelola
              </button>
            </div>

            {role === "MEMBER" ? (
              <form onSubmit={handleMemberSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Username</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" value={memberForm.username} onChange={(e) => setMemberForm({ ...memberForm, username: e.target.value })} placeholder="Contoh: budi123" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={memberForm.password} onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })} placeholder="Minimal 6 karakter" className="w-full pl-4 pr-11 py-3 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-[#1a120b] text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-600/50 hover:text-amber-600 transition">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" value={memberForm.nama_member} onChange={(e) => setMemberForm({ ...memberForm, nama_member: e.target.value })} placeholder="Nama lengkap kamu" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Instansi</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" value={memberForm.instansi} onChange={(e) => setMemberForm({ ...memberForm, instansi: e.target.value })} placeholder="Contoh: PT Maju Jaya (opsional)" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">No. Telepon</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="tel" value={memberForm.telp} onChange={(e) => setMemberForm({ ...memberForm, telp: e.target.value })} placeholder="0812-3456-7890" className={inputClass} />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
                )}

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/20 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Daftar sebagai Member
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOwnerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Username</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" value={ownerForm.username} onChange={(e) => setOwnerForm({ ...ownerForm, username: e.target.value })} placeholder="Contoh: owner_coworking" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={ownerForm.password} onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })} placeholder="Minimal 6 karakter" className="w-full pl-4 pr-11 py-3 rounded-xl border border-amber-200 bg-[#faf6f0] focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition text-[#1a120b] text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-amber-600/50 hover:text-amber-600 transition">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Coworking Space</label>
                  <div className="relative">
                    <Star className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" value={ownerForm.nama_coworking} onChange={(e) => setOwnerForm({ ...ownerForm, nama_coworking: e.target.value })} placeholder="Contoh: Coworking Nusantara" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Nama Pemilik</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" value={ownerForm.nama_pemilik} onChange={(e) => setOwnerForm({ ...ownerForm, nama_pemilik: e.target.value })} placeholder="Nama lengkap pemilik" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">No. Telepon</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-amber-600/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="tel" value={ownerForm.telp} onChange={(e) => setOwnerForm({ ...ownerForm, telp: e.target.value })} placeholder="0812-3456-7890" className={inputClass} />
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
                )}

                <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-amber-900/20 disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Mendaftar...
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" /> Daftar sebagai Pengelola
                    </>
                  )}
                </button>
              </form>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
              Sudah punya akun?{" "}
              <Link href="/sign-in" className="text-amber-700 font-semibold hover:text-amber-800">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}