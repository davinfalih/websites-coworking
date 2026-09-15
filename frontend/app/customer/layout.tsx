// app/customer/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  CalendarClock,
  User,
  LogOut,
  Menu,
  X,
  Building2,
} from 'lucide-react';
import Navbar from '@/components/navbar/Navbar';

const menuItems = [
  { name: 'Jelajahi Space', icon: LayoutGrid, href: '/customer/spaces' },
  { name: 'Reservasi Saya', icon: CalendarClock, href: '/customer/reservasi' },
  { name: 'Profil Saya', icon: User, href: '/customer/profile' },
  { name: 'Website', icon: Building2, href: '/' },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [memberName, setMemberName] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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

    try {
      const parsed = JSON.parse(userData);
      if (parsed.role !== 'MEMBER') {
        router.push('/admin/profile');
        return;
      }
      setMemberName(parsed.username || null);
    } catch {
      router.push('/sign-in');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-800 font-serif">Memuat...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/sign-in');
  };

  const isProductPage = pathname === '/customer/spaces' || pathname?.startsWith('/customer/spaces/');

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <Navbar />

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-gradient-to-br from-amber-700 to-amber-600 text-white shadow-xl shadow-amber-900/30"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed right-0 top-0 z-40 h-full w-72 bg-white border-l border-amber-100 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold">
              {memberName?.charAt(0)?.toUpperCase() || 'M'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1a120b] text-sm truncate">@{memberName || 'Member'}</p>
              <p className="text-xs text-amber-600">Member</p>
            </div>
          </div>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors group mb-1">
              <item.icon className="w-5 h-5 group-hover:text-amber-600" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors group mt-4 border-t border-amber-100 pt-4">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </nav>
      </aside>

      <main>
        {isProductPage ? (
          children
        ) : (
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
        )}
      </main>
    </div>
  );
}