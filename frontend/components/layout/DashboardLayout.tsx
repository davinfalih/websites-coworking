// components/layout/DashboardLayout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutGrid,
  CalendarClock,
  User,
  LogOut,
  Menu,
  X,
  Building2,
} from 'lucide-react';

interface User {
  username: string;
  role: string;
}

const menuItems = [
  { name: 'Jelajahi Space', icon: LayoutGrid, href: '/customer/spaces' },
  { name: 'Reservasi Saya', icon: CalendarClock, href: '/customer/reservasi' },
  { name: 'Profil Saya', icon: User, href: '/customer/profile' },
  { name: 'Website', icon: Building2, href: '/customer/spaces' },
];

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      router.push('/sign-in');
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      if (parsed.role === 'ADMIN_SPACE') {
        router.push('/admin/profile');
        return;
      }
      setUser(parsed);
    } catch {
      router.push('/sign-in');
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
          <p className="text-amber-800 font-serif">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf6f0]">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg text-amber-700 border border-amber-100"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-amber-100 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-amber-100">
          <Link href="/customer/spaces" className="block text-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent font-serif">
              Smart Space Booking
            </h1>
            <p className="text-[10px] text-amber-600 tracking-wider mt-1">Coworking Space</p>
          </Link>
          <div className="mt-4 pt-3 border-t border-amber-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#1a120b] text-sm truncate">@{user?.username || 'User'}</p>
                <p className="text-xs text-amber-600 truncate">Member</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors group mb-1"
            >
              <item.icon className="w-5 h-5 group-hover:text-amber-600" />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors group mt-4 border-t border-amber-100 pt-4"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="flex items-center justify-center gap-2 opacity-30">
            <div className="w-8 h-px bg-amber-600" />
            <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
              <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor" className="text-amber-600"/>
            </svg>
            <div className="w-8 h-px bg-amber-600" />
          </div>
        </div>
      </aside>

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};