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
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_0_rgba(15,23,42,0.04)] transition-all hover:shadow-lg h-full flex flex-col">

        <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-800">
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
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-4xl text-emerald-200/70">{TYPE_ICON[space.tipe] || '◼'}</span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-emerald-100/70 font-semibold">
                {SPACE_TYPE_LABEL[space.tipe] || space.tipe}
              </span>
            </div>
          )}

          {/* Badge tipe */}
          <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-emerald-900/80 text-white">
            <span className="text-[9px] font-semibold tracking-wider uppercase">
              {SPACE_TYPE_LABEL[space.tipe] || space.tipe}
            </span>
          </div>
        </div>

        {/* Konten Teks */}
        <div className="p-4 flex flex-col flex-grow">
          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 truncate mb-1">
            {space.owner?.nama_coworking || 'Coworking Space'}
          </p>
          <Link href={reserveHref ?? `/spaces/${space.id}`}>
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-emerald-700 transition-colors leading-snug min-h-[40px]">
              {space.nama_space}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mt-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">Kap. {space.kapasitas} org</span>
            <span className="text-xs text-slate-400 ml-auto">per jam</span>
          </div>
        </div>

        {/* Bagian Bawah: Harga + Tombol */}
        <div className="px-4 pb-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">Harga Sewa</span>
            <span className="text-lg font-bold text-emerald-700 tracking-tight truncate">
              {formatRupiah(space.harga_per_jam)}
              <span className="text-xs font-medium text-slate-400 ml-1">/jam</span>
            </span>
          </div>

          {onReserve ? (
            <button
              type="button"
              onClick={() => onReserve(space)}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-3 transition-all duration-200 active:scale-95 shadow-sm"
              title="Reservasi Sekarang"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Reservasi</span>
            </button>
          ) : (
            <Link
              href={reserveHref ?? `/spaces/${space.id}`}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold py-2 px-3 transition-all duration-200 active:scale-95 shadow-sm"
              title="Lihat Detail"
            >
              <CalendarClock className="w-3.5 h-3.5" />
              <span>Detail</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}