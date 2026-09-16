'use client';

import { useState, useEffect } from 'react';

export const LoadingScreen = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onLoad = () => setLoading(false);

    if (document.readyState === 'complete') {
      const id = setTimeout(onLoad, 0);
      return () => clearTimeout(id);
    }

    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 transition-opacity duration-700">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 rotate-45 animate-spin rounded-xl border-2 border-emerald-600/20" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-3 -rotate-6 animate-spin rounded-xl border-2 border-emerald-600/30" style={{ animationDuration: '2.4s' }} />
            <div className="absolute inset-6 rotate-12 animate-spin rounded-xl border-2 border-emerald-600/50" style={{ animationDuration: '1.8s' }} />
            <div className="absolute inset-9 rotate-45 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700" />
          </div>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-slate-900">Nexus</h1>
          <p className="mt-1 text-sm text-emerald-600/70">Workstation &amp; Booking</p>
          <p className="mt-3 text-xs text-slate-400">Memuat...</p>
        </div>
      )}
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
        {children}
      </div>
    </>
  );
};