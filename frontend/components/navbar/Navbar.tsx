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

const BatikOrnament = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    className="text-amber-500/70"
  >
    <path
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" />
  </svg>
);

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
      href: "/customer/spaces",
      dropdown: [
        { name: "Semua Space", href: "/customer/spaces" },
        { name: "Personal Desk", href: "/customer/spaces?tipe=DESK" },
        { name: "Meeting Room", href: "/customer/spaces?tipe=MEETING_ROOM" },
        { name: "Private Office", href: "/customer/spaces?tipe=PRIVATE_OFFICE" },
      ],
    },
    { name: "Cara Booking", href: "/#cara-booking" },
    { name: "Tentang", href: "/#tentang" },
    { name: "Kontak", href: "/#kontak" },
  ], []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : (href.includes('/customer/spaces') ? pathname?.startsWith('/customer/spaces') : pathname === href.split('#')[0]);

  const profileHref = isAuthenticated
    ? userRole === 'ADMIN_SPACE' ? '/admin/profile' : '/customer/profile'
    : '/sign-in';

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <div
          className={`transition-all duration-500 ${isScrolled ? "h-0 overflow-hidden" : "h-7 bg-[#1a0f08]"}`}
        >
          <div className="container mx-auto px-6 h-full flex items-center justify-between">
            <p className="text-[10px] text-amber-400/70 tracking-[0.2em] uppercase font-medium">
              ✦ Reservasi Coworking Space Mudah & Cepat ✦
            </p>
            <div className="flex items-center gap-4 text-[10px] text-amber-400/60 tracking-wider">
              {isAuthenticated ? (
                <>
                  <Link href={profileHref} className="text-amber-300/80 hover:text-amber-300 transition">
                    {userName}
                  </Link>
                  <span className="text-amber-700">|</span>
                  <button
                    onClick={handleLogout}
                    className="hover:text-amber-300 transition"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="hover:text-amber-300 transition"
                  >
                    Masuk
                  </Link>
                  <span className="text-amber-700">|</span>
                  <Link
                    href="/sign-up"
                    className="hover:text-amber-300 transition"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <nav
          className={`transition-all duration-500 ${isScrolled
              ? "bg-[#1c1008]/97 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-amber-800/20"
              : "bg-gradient-to-b from-[#1a0f08]/95 to-[#1a0f08]/80 backdrop-blur-sm"
            }`}
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex justify-between items-center h-[68px]">
              <Link
                href="/"
                className="group flex items-center gap-2.5 shrink-0"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-600/30 transition-all duration-300">
                    <BatikOrnament />
                  </div>
                </div>
                <div>
                  <div className="font-serif text-xl text-white tracking-wide leading-none group-hover:text-amber-200 transition-colors duration-300">
                    Smart Space
                  </div>
                  <div className="text-[8px] text-amber-500/70 tracking-[0.25em] uppercase mt-0.5">
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
                          ? "text-amber-400"
                          : "text-amber-100/80 hover:text-amber-300"
                        }`}
                    >
                      <span className="relative">
                        {link.name}
                        {isActive(link.href) && (
                          <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-amber-500 rounded-full" />
                        )}
                      </span>
                      {link.dropdown && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""}`}
                        />
                      )}
                    </Link>

                    {link.dropdown && activeDropdown === link.name && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-[#1c1008] border border-amber-800/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                        <div className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
                        <div className="py-2">
                          {link.dropdown.map((item: any) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="flex items-center justify-between gap-2.5 px-4 py-2.5 text-sm text-amber-100/70 hover:text-amber-300 hover:bg-amber-900/30 transition-all duration-150"
                            >
                              <span className="flex items-center gap-2.5 min-w-0">
                                <span className="w-1 h-1 rounded-full bg-amber-600/50 shrink-0" />
                                <span className="truncate">{item.name}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-amber-600/40 to-transparent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={profileHref}
                  className="hidden md:flex p-2.5 text-amber-100/70 hover:text-amber-300 hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                  aria-label="Akun saya"
                >
                  <User className="w-4.5 h-4.5" />
                </Link>

                {isAuthenticated && (
                  <Link
                    href={userRole === 'ADMIN_SPACE' ? '/admin/spaces' : '/customer/reservasi'}
                    className="hidden md:flex p-2.5 text-amber-100/70 hover:text-amber-300 hover:bg-amber-900/30 rounded-lg transition-all duration-200"
                    aria-label="Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>
                )}

                <Link
                  href={isAuthenticated ? "/customer/spaces" : "/sign-in"}
                  className="relative flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white px-4 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-amber-900/30"
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
                    className="hidden md:flex p-2.5 text-amber-100/70 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    aria-label="Keluar"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}

                <button
                  className="lg:hidden p-2.5 text-amber-100/80 hover:text-amber-300 hover:bg-amber-900/30 rounded-lg transition ml-1"
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
            </div>
          </div>

          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-400 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-80 max-w-full bg-[#140d06] border-l border-amber-800/20 shadow-2xl transition-transform duration-400 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between p-5 border-b border-amber-800/20">
            <div className="font-serif text-lg text-white">Smart Space Booking</div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-amber-400 hover:bg-amber-900/30 rounded-lg transition"
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
                      ? "text-amber-400 bg-amber-900/20 border-r-2 border-amber-500"
                      : "text-amber-100/80 hover:text-amber-300 hover:bg-amber-900/20"
                    }`}
                >
                  {link.name}
                </Link>
              </div>
            ))}

            <div className="mx-5 mt-6 pt-6 border-t border-amber-800/20 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="text-center text-amber-300/80 text-sm font-medium py-2">
                    {userName}
                  </div>
                  <Link
                    href={userRole === 'ADMIN_SPACE' ? '/admin/profile' : '/customer/profile'}
                    className="flex items-center justify-center gap-2 w-full border border-amber-700/40 text-amber-300 py-3 rounded-xl text-sm font-medium hover:bg-amber-900/20 transition"
                  >
                    <User className="w-4 h-4" /> Profil Saya
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full border border-red-700/40 text-red-400 py-3 rounded-xl text-sm font-medium hover:bg-red-900/20 transition"
                  >
                    <LogOut className="w-4 h-4" /> Keluar
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="flex items-center justify-center gap-2 w-full border border-amber-700/40 text-amber-300 py-3 rounded-xl text-sm font-medium hover:bg-amber-900/20 transition"
                  >
                    <User className="w-4 h-4" /> Masuk
                  </Link>
                  <Link
                    href="/sign-up"
                    className="flex items-center justify-center gap-2 w-full bg-amber-700 text-white py-3 rounded-xl text-sm font-medium hover:bg-amber-600 transition"
                  >
                    Daftar Sekarang
                  </Link>
                </>
              )}
            </div>

            <p className="text-center text-[10px] text-amber-700/50 italic font-serif mt-8 px-5">
              "Reservasi Space, Tinggal Klik!"
            </p>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div
        className={`transition-all duration-500 ${isScrolled ? "h-[68px]" : "h-[95px]"}`}
      />
    </>
  );
}