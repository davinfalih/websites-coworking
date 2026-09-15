// app/dashboard/page.tsx
'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.replace("/sign-in");
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      if (user.role === "ADMIN_SPACE") {
        router.replace("/admin/profile");
      } else {
        router.replace("/customer/spaces");
      }
    } catch {
      router.replace("/sign-in");
    }
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf6f0]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-lg animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-2 border-2 border-amber-600/30 -rotate-6 rounded-lg animate-spin" style={{ animationDuration: '2.4s' }} />
        <div className="absolute inset-4 border-2 border-amber-600/50 rotate-12 rounded-lg animate-spin" style={{ animationDuration: '1.8s' }} />
        <div className="absolute inset-6 bg-gradient-to-br from-amber-600 to-amber-700 rotate-45 rounded-lg" />
      </div>
      <p className="mt-6 font-serif text-[#1a120b]">Mengalihkan ke dashboard...</p>
    </div>
  );
}