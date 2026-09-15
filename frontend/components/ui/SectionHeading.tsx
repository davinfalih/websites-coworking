'use client';

import { BatikBorder } from './BatikBorder';

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
}

export const SectionHeading = ({ label, title, subtitle }: SectionHeadingProps) => (
  <div className="text-center mb-8">
    <div className="flex items-center justify-center gap-3 mb-3">
      <div className="w-12 h-px bg-amber-600/40" />
      <span className="text-amber-700 text-xs font-bold tracking-[0.25em] uppercase">{label}</span>
      <div className="w-12 h-px bg-amber-600/40" />
    </div>
    <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#1a120b] mb-2">{title}</h2>
    {subtitle && <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">{subtitle}</p>}
    <BatikBorder />
  </div>
);