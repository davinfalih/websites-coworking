// app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutGrid,
  CalendarClock,
  LogOut,
  Menu,
  X,
  Building2,
  Percent,
  Users,
  BarChart3,
  Store,
  Search,
  Bell,
  Wifi,
  ChevronRight,
  ChevronsUpDown,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Reservasi', icon: CalendarClock, href: '/admin/reservasi' },
  { name: 'Data Space', icon: Building2, href: '/admin/spaces' },
  { name: 'Data Diskon', icon: Percent, href: '/admin/diskon' },
  { name: 'Data Member', icon: Users, href: '/admin/members' },
  { name: 'Laporan Pendapatan', icon: BarChart3, href: '/admin/reports' },
  { name: 'Profil Coworking', icon: Store, href: '/admin/profile' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ username?: string; role?: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('admin_sidebar_collapsed') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('admin_sidebar_collapsed', sidebarCollapsed ? '1' : '0');
    } catch {
      // abaikan jika localStorage tidak tersedia
    }
  }, [sidebarCollapsed]);

  const handleToggleSidebar = () => setSidebarCollapsed((v) => !v);

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

  const isActive = (item: { name: string; href: string }) =>
    pathname === item.href || (item.href !== '/admin/profile' && pathname?.startsWith(item.href + '/'));

  const currentTitle = menuItems.find((m) => isActive(m))?.name ?? 'Dashboard';

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-700 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Menyiapkan panel pengelola...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm lg:hidden"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-64 transform flex-col bg-slate-900 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          !sidebarCollapsed && 'lg:translate-x-0',
          sidebarCollapsed && 'lg:-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="border-b border-slate-800 p-5">
          <Link href="/admin/profile" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M4 20V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v13H4Z" fill="currentColor" opacity="0.35" />
                <path d="M2 20h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 20v-8m4 8V6m4 14v-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="18.5" cy="4.5" r="2.2" fill="#10B981" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-base font-semibold tracking-tight text-white">Nexus</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Coworking Admin
              </p>
            </div>
            <span className="ml-auto rounded-md bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              v2.4
            </span>
          </Link>
        </div>

        {/* Branch / system status */}
        <div className="px-4 pt-4">
          <div className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
            <div className="flex items-center gap-2 text-slate-300">
              <Wifi className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-medium">Sistem Online</span>
              <span className="ml-auto inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Gateway Hub &bull; Smart Access</p>
          </div>
        </div>

        {/* Menu */}
        <p className="px-5 pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Menu Utama
        </p>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4">
          {menuItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                  active
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
                )}
              >
                <item.icon className={cn('h-4.5 w-4.5 shrink-0', active ? 'text-white' : 'text-slate-500')} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-800 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-950/50 hover:text-red-300"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      <main className={cn('min-h-screen transition-all duration-300', sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-64')}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 md:px-6 lg:px-8">
          <button
            onClick={handleToggleSidebar}
            className="hidden lg:flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-emerald-700"
            title={sidebarCollapsed ? 'Tampilkan Sidebar' : 'Sembunyikan Sidebar'}
          >
            {sidebarCollapsed ? <PanelLeftOpen className="h-4.5 w-4.5" /> : <PanelLeftClose className="h-4.5 w-4.5" />}
          </button>

          <div className="hidden lg:flex items-center gap-1.5 text-sm text-slate-400">
            <span>Admin Console</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-900">{currentTitle}</span>
          </div>

          <div className="relative ml-auto hidden md:block w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Cari reservasi, member..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              ⌘K
            </kbd>
          </div>

          <button className="relative ml-auto rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 md:ml-0">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 py-1 pl-1 pr-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-700 text-sm font-semibold text-white">
              {user?.username?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="hidden sm:block leading-tight">
              <p className="text-xs font-semibold text-slate-800">@{user?.username || 'Admin'}</p>
              <p className="text-[11px] text-slate-500">Super Admin</p>
            </div>
            <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </div>
      </main>
    </div>
  );
}