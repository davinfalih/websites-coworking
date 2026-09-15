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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf6f0] transition-opacity duration-700">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-2 border-amber-600/20 rotate-45 rounded-lg animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-3 border-2 border-amber-600/30 -rotate-6 rounded-lg animate-spin" style={{ animationDuration: '2.4s' }} />
            <div className="absolute inset-6 border-2 border-amber-600/50 rotate-12 rounded-lg animate-spin" style={{ animationDuration: '1.8s' }} />
            <div className="absolute inset-9 bg-gradient-to-br from-amber-600 to-amber-700 rotate-45 rounded-lg" />
          </div>
          <h1 className="mt-8 text-2xl font-semibold tracking-wide text-[#1a120b]">
            Smart Space Booking
          </h1>
          <p className="mt-1 text-sm text-amber-600/70">Coworking Space</p>
          <p className="mt-3 text-xs text-amber-600/50">Memuat...</p>
        </div>
      )}
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease-in' }}>
        {children}
      </div>
    </>
  );
};