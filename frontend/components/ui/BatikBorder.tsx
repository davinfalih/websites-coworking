'use client';

export const BatikBorder = () => (
  <div className="flex items-center gap-3 my-2">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-600/40" />
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-amber-600/60 shrink-0">
      <path d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z" fill="currentColor"/>
    </svg>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-600/40" />
  </div>
);