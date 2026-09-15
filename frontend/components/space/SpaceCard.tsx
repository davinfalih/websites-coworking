'use client';

import Link from 'next/link';
import { Users, CalendarClock } from 'lucide-react';
import type { Space } from '@/types';
import { SPACE_TYPE_LABEL, formatRupiah } from '@/lib/api';

interface SpaceCardProps {
  space: Space;
  onReserve?: (space: Space) => void | Promise<void>;
  reserveHref?: string;
}

const TYPE_ICON: Record<string, string> = {
  DESK: '◼',
  MEETING_ROOM: '◻',
  PRIVATE_OFFICE: '◈',
};

export default function SpaceCard({ space, onReserve, reserveHref }: SpaceCardProps) {
  const imgSrc = space.foto && space.foto !== '' ? space.foto : null;

  return (
    <div className="relative group h-full">
      <div className="relative overflow-hidden rounded-xl border border-amber-700/30 bg-[#1a120b] shadow-md transition-all duration-300 hover:border-amber-600/50 hover:shadow-amber-900/20 h-full flex flex-col justify-between">

        {/* Ornamen Latar Belakang Batik */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='25' height='25' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
            backgroundSize: '25px 25px',
          }}
        />

        <div className="flex flex-col flex-grow">
          {/* FOTO 1:1 */}
          <div className="relative aspect-square w-full overflow-hidden bg-amber-900/10 border-b border-amber-900/20">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={space.nama_space}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-amber-900/30 to-[#1a120b]">
                <span className="text-4xl text-amber-600/40">{TYPE_ICON[space.tipe] || '◼'}</span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-amber-500/50 font-semibold">
                  {SPACE_TYPE_LABEL[space.tipe] || space.tipe}
                </span>
              </div>
            )}

            {/* Badge tipe */}
            <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-amber-600/40">
              <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-amber-300">
                {SPACE_TYPE_LABEL[space.tipe] || space.tipe}
              </span>
            </div>
          </div>

          {/* Konten Teks */}
          <div className="p-3 flex flex-col flex-grow justify-between gap-1">
            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-amber-400/80 truncate mb-0.5">
                {space.owner?.nama_coworking || 'Coworking Space'}
              </p>
              <Link href={reserveHref ?? `/customer/spaces/${space.id}`}>
                <h3 className="font-serif text-xs font-semibold text-amber-100 line-clamp-2 hover:text-amber-300 transition-colors leading-tight min-h-[32px]">
                  {space.nama_space}
                </h3>
              </Link>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <Users className="w-2.5 h-2.5 text-amber-400/70" />
              <span className="text-[9px] text-amber-400/60 font-mono">Kap. {space.kapasitas} org</span>
              <span className="text-[9px] text-amber-500/40 font-serif ml-auto">per jam</span>
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Harga + Tombol */}
        <div className="px-3 pb-3 pt-2 border-t border-amber-900/20 bg-amber-950/20 flex items-center justify-between gap-1.5">
          <div className="flex flex-col min-w-0">
            <span className="text-[7px] text-amber-500/40 font-bold tracking-[0.15em] uppercase">Harga Sewa</span>
            <span className="text-xs font-bold text-amber-300 tracking-tight truncate">
              {formatRupiah(space.harga_per_jam)}
            </span>
          </div>

          {onReserve ? (
            <button
              type="button"
              onClick={() => onReserve(space)}
              className="shrink-0 relative overflow-hidden flex items-center justify-center w-11 h-11 rounded-lg border border-amber-600/40 bg-gradient-to-br from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white transition-all duration-200 active:scale-90 shadow-md group/btn"
              title="Reservasi Sekarang"
            >
              <CalendarClock className="w-5 h-5 transition-transform group-hover/btn:-translate-y-0.5" />
            </button>
          ) : (
            <Link
              href={reserveHref ?? `/customer/spaces/${space.id}`}
              className="shrink-0 relative overflow-hidden flex items-center justify-center w-11 h-11 rounded-lg border border-amber-600/40 bg-gradient-to-br from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white transition-all duration-200 active:scale-90 shadow-md group/btn"
              title="Lihat Detail"
            >
              <CalendarClock className="w-5 h-5 transition-transform group-hover/btn:-translate-y-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}