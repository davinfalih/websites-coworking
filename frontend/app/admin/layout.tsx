// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutGrid,
  CalendarClock,
  User,
  LogOut,
  Menu,
  X,
  Building2,
  Percent,
  Users,
  BarChart3,
} from 'lucide-react';

const menuItems = [
  { name: 'Profil', icon: User, href: '/admin/profile' },
  { name: 'Space', icon: Building2, href: '/admin/spaces' },
  { name: 'Diskon', icon: Percent, href: '/admin/diskon' },
  { name: 'Member', icon: Users, href: '/admin/members' },
  { name: 'Reservasi', icon: CalendarClock, href: '/admin/reservasi' },
  { name: 'Laporan', icon: BarChart3, href: '/admin/reports' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ username?: string; role?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userRaw = localStorage.getItem('user');
    if (!token || !userRaw) {
      router.replace('/sign-in');
      return;
    }
    try {
      const parsed = JSON.parse(userRaw);
      if (parsed.role !== 'ADMIN_SPACE') {
        router.replace('/customer/spaces');
        return;
      }
      setUser(parsed);
    } catch {
      router.replace('/sign-in');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/sign-in');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-800 font-serif">Memuat dashboard pengelola...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg text-amber-700 border border-amber-100"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 z-40 h-full w-64 bg-[#1a0f08] border-r border-amber-800/30 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>
        <div className="p-5 border-b border-amber-800/30 bg-gradient-to-b from-amber-900/20 to-transparent">
          <Link href="/admin/profile" className="block text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-6 h-[2px] bg-amber-600/40" />
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="text-amber-500">
                <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" />
              </svg>
              <div className="w-6 h-[2px] bg-amber-600/40" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent font-serif">
              Pengelola
            </h1>
            <p className="text-[9px] text-amber-600 tracking-[0.2em] uppercase">Panel Kelola Space</p>
          </Link>
          <div className="mt-4 pt-3 border-t border-amber-800/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || 'P'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-amber-100 text-sm truncate">@{user?.username || 'Pengelola'}</p>
                <p className="text-xs text-amber-500/80 truncate">ADMIN SPACE</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin/profile' && pathname?.startsWith(item.href + '/'));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group mb-1 border border-transparent ${
                  active
                    ? 'bg-amber-600/15 text-amber-300 border-amber-600/30'
                    : 'text-amber-100/50 hover:bg-amber-900/20 hover:text-amber-200'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-amber-400' : 'group-hover:text-amber-400'}`} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-amber-800/30">
          <Link
            href="/"
            className="flex items-center gap-2 mb-2 px-4 py-2.5 text-xs text-amber-100/40 hover:text-amber-300 hover:bg-amber-900/20 rounded-lg transition"
          >
            <LayoutGrid className="w-4 h-4" /> Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors group"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}