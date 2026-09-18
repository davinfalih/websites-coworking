'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutGrid, CalendarDays, User } from 'lucide-react';
import { createClient } from '@/lib/api';
import { NexusMark } from '@/components/ui/Logo';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const client = createClient();
  const [memberName, setMemberName] = useState<string | null>(null);
  const [memberFoto, setMemberFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    let token: string | null = null;
    let userData: string | null = null;
    try {
      token = localStorage.getItem('access_token');
      userData = localStorage.getItem('user');
    } catch {
      router.push('/sign-in');
      return;
    }

    if (!token || !userData) {
      router.push('/sign-in');
      return;
    }

    (async () => {
      let fallback: string | null = null;
      try {
        const parsed = JSON.parse(userData as string);
        if (parsed.role !== 'MEMBER') {
          router.push('/admin/profile');
          return;
        }
        fallback = parsed.username || null;
        setMemberName(fallback);
      } catch {
        router.push('/sign-in');
        return;
      } finally {
        setLoading(false);
      }

      try {
        const profile = await client.getMyMemberProfile();
        setMemberName(profile.nama_member || fallback);
        setMemberFoto(profile.foto || null);
      } catch {
        // fallback: nama dari sesi login
      }
    })();
  }, [router, client, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-emerald-800 font-sans">Memuat...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/sign-in');
  };

  return (
    <div className="h-full min-h-screen flex flex-col bg-surface-base text-surface-dark antialiased overflow-x-hidden font-sans">
      
      {/* TOP HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <NexusMark className="w-9 h-9 group-hover:scale-105 transition-transform" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-lg tracking-tight text-slate-900">Nexus</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-1">Member Portal</p>
              </div>
            </Link>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-brand-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition">
              <svg className="w-3.5 h-3.5 text-brand-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
              </svg>
              <span>Pusat Bantuan</span>
            </button>

            <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition" title="Notifikasi">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600 ring-2 ring-white"></span>
            </button>

            <div className="h-6 w-px bg-slate-200"></div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-lg hover:bg-slate-100 border border-slate-200/80 transition text-left focus:outline-none focus:ring-2 focus:ring-brand-700/20">
                <div className="w-8 h-8 rounded-full bg-brand-700 text-white flex items-center justify-center font-semibold text-xs ring-2 ring-brand-100 overflow-hidden">
                  {memberFoto ? (
                    <img src={memberFoto} alt={memberName || 'Member'} className="w-full h-full object-cover" />
                  ) : (
                    memberName?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden sm:block leading-tight">
                  <p className="text-xs font-semibold text-slate-800">{memberName}</p>
                  <p className="text-[11px] text-slate-500 font-mono">Member Verified</p>
                </div>
                <svg className="w-4 h-4 text-slate-400 ml-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{memberName}</p>
                    <p className="text-[11px] text-slate-500 truncate">member@nexus.id</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Membership Aktif
                    </div>
                  </div>
                  <div className="py-1">
                    <Link href="/customer/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700 transition">
                      Profil Akun
                    </Link>
                    <Link href="/customer/reservasi" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-700 transition">
                      Reservasi Saya
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition">
                      Keluar (Logout)
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* BODY WRAPPER: MAIN CONTENT */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto relative">
        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 p-4 lg:p-8 pb-32 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* FLOATING GLASS NAVBAR (Navigasi Utama) */}
      <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/60 bg-white/70 backdrop-blur-xl shadow-lg shadow-slate-900/10 p-1.5">
          <Link
            href="/customer/spaces"
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              pathname.includes('/spaces')
                ? 'bg-brand-700 text-white shadow-md shadow-brand-700/30'
                : 'text-slate-600 hover:bg-white/90'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Beranda / Katalog</span>
          </Link>
          <Link
            href="/customer/reservasi"
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              pathname.includes('/reservasi')
                ? 'bg-brand-700 text-white shadow-md shadow-brand-700/30'
                : 'text-slate-600 hover:bg-white/90'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Reservasi Saya</span>
          </Link>
          <Link
            href="/customer/profile"
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              pathname.includes('/profile')
                ? 'bg-brand-700 text-white shadow-md shadow-brand-700/30'
                : 'text-slate-600 hover:bg-white/90'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil Member</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}