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
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" />
        <div className="absolute inset-2 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
      </div>
      <p className="mt-6 text-sm text-slate-500">Mengalihkan ke dashboard...</p>
    </div>
  );
}