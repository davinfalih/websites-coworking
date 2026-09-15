// components/navbar/NavbarWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isCustomer = pathname?.startsWith('/customer');

  if (isAdmin || isCustomer) return null;

  return <Navbar />;
}