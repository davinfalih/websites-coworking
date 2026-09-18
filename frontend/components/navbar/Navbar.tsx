// components/navbar/Navbar.tsx
'use client';

import Link from "next/link";
import {
  CalendarClock,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { NexusMark } from "@/components/ui/Logo";

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userData);
        setUserName(user.username);
        setUserRole(user.role);
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    } else {
      setIsAuthenticated(false);
      setUserName(null);
      setUserRole(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserName(null);
    router.push('/');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const navLinks = useMemo(() => [
    { name: "Beranda", href: "/" },
    {
      name: "Space",
      href: "/spaces",
      dropdown: [
        { name: "Semua Space", href: "/spaces" },
        { name: "Personal Desk", href: "/spaces?tipe=DESK" },
        { name: "Meeting Room", href: "/spaces?tipe=MEETING_ROOM" },
        { name: "Private Office", href: "/spaces?tipe=PRIVATE_OFFICE" },
      ],
    },
    { name: "Cara Booking", href: "/#cara-booking" },
    { name: "Tentang", href: "/#tentang" },
    { name: "Kontak", href: "/#kontak" },
  ], []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : (href.includes('/spaces') ? pathname?.startsWith('/spaces') : pathname === href.split('#')[0]);

  const profileHref = isAuthenticated
    ? userRole === 'ADMIN_SPACE' ? '/admin/profile' : '/customer/profile'
    : '/sign-in';

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <nav
            className={`flex items-center justify-between gap-3 rounded-full px-4 sm:px-5 transition-all duration-500 ${
              isScrolled
                ? "mt-2 h-14 bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-900/10 border border-slate-200"
                : "mt-3 h-[60px] bg-white/80 backdrop-blur-md border border-white/70"
            }`}
          >
            <Link
              href="/"
              className="group flex items-center gap-2.5 shrink-0"
            >
              <div className="relative">
                <NexusMark className="w-10 h-10 drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <div className="font-bold text-xl text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors duration-300">
                    Nexus
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 tracking-[0.2em] uppercase font-semibold mt-0.5">
                  Coworking Space
                </div>
              </div>
            </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() =>
                      link.dropdown && setActiveDropdown(link.name)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive(link.href)
                          ? "text-emerald-700"
                          : "text-slate-600 hover:text-emerald-700"
                        }`}
                    >
                      <span className="relative">
                        {link.name}
                        {isActive(link.href) && (
                          <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-emerald-600 rounded-full" />
                        )}
                      </span>
                      {link.dropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`}
                        />
                      )}
                    </Link>

                    {link.dropdown && activeDropdown === link.name && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-900/5 overflow-hidden z-50">
                        <div className="py-2">
                          {link.dropdown.map((item: any) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center justify-between gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-150"
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span className="w-1 h-1 rounded-full bg-emerald-300 shrink-0" />
                                <span className="truncate">{item.name}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={profileHref}
                  className="hidden md:flex p-2.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all duration-200"
                  aria-label="Akun saya"
                >
                  <User className="w-4.5 h-4.5" />
                </Link>

                {isAuthenticated && (
                  <Link
                    href={userRole === 'ADMIN_SPACE' ? '/admin/spaces' : '/customer/reservasi'}
                    className="hidden md:flex p-2.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-all duration-200"
                    aria-label="Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                )}

                <Link
                  href={isAuthenticated ? "/customer/spaces" : "/spaces"}
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-full transition-all duration-200 shadow-sm"
                  aria-label="Reservasi space"
                >
                  <CalendarClock className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm font-medium">
                    Reservasi
                  </span>
                </Link>

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="hidden md:flex p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    aria-label="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}

                <button
                  className="lg:hidden p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition ml-1"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-400 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-full bg-white border-l border-slate-200 shadow-2xl transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <NexusMark className="w-9 h-9" />
              <div className="font-bold text-lg text-slate-900 tracking-tight">Nexus Booking</div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto h-full pb-24 py-4">
            {navLinks.map((link) => (
              <div key={link.name}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-all ${isActive(link.href)
                      ? "text-emerald-700 bg-emerald-50 border-r-2 border-emerald-600"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-slate-50"
                    }`}
                >
                  {link.name}
                </Link>
              </div>
            ))}

            <div className="mx-5 mt-6 pt-6 border-t border-slate-200 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-center text-slate-800 text-sm font-medium py-2">
                    {userName}
                  </div>
                  <Link
                    href={userRole === 'ADMIN_SPACE' ? '/admin/profile' : '/customer/profile'}
                    className="flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                  >
                    <User className="w-4 h-4" /> Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full border border-red-200 text-red-600 py-3 rounded-xl text-sm font-medium hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                  >
                    <User className="w-4 h-4" /> Masuk
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center justify-center gap-2 w-full bg-emerald-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-emerald-600 transition"
                  >
                    Daftar Sekarang
                  </Link>
                </>
              )}
            </div>

            <p className="text-center text-[11px] text-slate-400 font-medium mt-8 px-5">
              "Reservasi Space, Tinggal Klik!"
            </p>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[84px]" />
    </>
  );
}