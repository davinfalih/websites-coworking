// app/customer/reservasi/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Printer, QrCode, MapPin, Clock, Building2, CalendarDays, CheckCircle2 } from 'lucide-react';
import { api, RESERVASI_STATUS_LABEL, formatRupiah, formatDate } from '@/lib/api';
import type { Reservasi } from '@/types';

const statusPillHero: Record<string, string> = {
  BELUM_DIKONFIRM: 'bg-amber-100 text-amber-900 border-amber-200',
  DISETUJUI: 'bg-blue-100 text-blue-900 border-blue-200',
  AKTIF: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  SELESAI: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  DIBATALKAN: 'bg-red-100 text-red-900 border-red-200',
};

const TIPE_LABEL: Record<string, string> = {
  DESK: 'Personal Desk',
  MEETING_ROOM: 'Meeting Room',
  PRIVATE_OFFICE: 'Private Office',
};

const steps = ['BELUM_DIKONFIRM', 'DISETUJUI', 'AKTIF', 'SELESAI'];

export default function EticketPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [ticket, setTicket] = useState<Reservasi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getEticket(id)
      .then((data) => setTicket(data))
      .catch((e: any) => setError(e?.message || 'Ticket tidak ditemukan.'))
      .finally(() => setLoading(false));
  }, [id]);

  const currentStep = ticket ? steps.indexOf(ticket.status) : -1;
  const grandTotal = ticket ? (ticket.details || []).reduce((s, d) => s + d.total_harga, 0) : 0;
  const firstDetail = ticket?.details?.[0];
  const jamSelesai = ticket ? Number(ticket.jam_mulai.slice(0, 2)) + ticket.durasi_jam : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/customer/reservasi" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm font-medium transition">
          <ChevronLeft className="w-4 h-4" /> Kembali ke reservasi
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-gray-400 text-sm">Memuat e-ticket...</div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-gray-500">{error}</p>
        </div>
      ) : ticket ? (
        <>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-700 p-6 md:p-8 text-white shadow-sm">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight">Nexus</span>
                  <span className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-100">E-Ticket Reservasi</span>
                </div>
                <p className="mt-5 font-mono text-3xl md:text-4xl font-bold tracking-tight">{ticket.kode_reservasi}</p>
                <p className="mt-3 text-sm text-emerald-100/90">{ticket.member?.nama_member || 'Member Nexus'}</p>
              </div>
              <span className={`inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium ${statusPillHero[ticket.status] || 'bg-white/15 text-white border-white/25'}`}>
                {RESERVASI_STATUS_LABEL[ticket.status] || ticket.status}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Detail Reservasi</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Coworking</p>
                  <p className="text-sm font-medium text-slate-900">{ticket.owner?.nama_coworking || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Space</p>
                  <p className="text-sm font-medium text-slate-900">{firstDetail?.space?.nama_space || '-'}</p>
                  <p className="text-xs text-slate-500">{firstDetail?.space?.tipe ? TIPE_LABEL[firstDetail.space.tipe] : ''}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Lokasi</p>
                  <p className="text-sm font-medium text-slate-900">Jakarta</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Tanggal</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(ticket.tanggal_reservasi)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Jam Sewa</p>
                  <p className="text-sm font-medium text-slate-900">{ticket.jam_mulai} - {jamSelesai}:00 ({ticket.durasi_jam} jam)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">Kapasitas</p>
                  <p className="text-sm font-medium text-slate-900">{firstDetail?.space?.kapasitas ? `${firstDetail.space.kapasitas} orang` : '-'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Rincian Pembayaran</h2>
            </div>
            <div className="p-6 space-y-3">
              {ticket.details?.map((d) => (
                <div key={d.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{d.space?.nama_space || '-'}</p>
                    <p className="text-xs text-slate-500">
                      {d.space?.tipe ? TIPE_LABEL[d.space.tipe] : ''}
                      {d.space?.kapasitas ? ` • Kap. ${d.space.kapasitas}` : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-slate-900 font-mono">{formatRupiah(d.total_harga)}</p>
                    {d.diskon && (
                      <p className="text-[10px] text-red-600">Diskon {d.diskon.kode_diskon} ({d.diskon.persentase_diskon}%)</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm font-semibold text-slate-700">Total Pembayaran</span>
                <span className="text-lg font-bold text-emerald-700 font-mono">{formatRupiah(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Status Proses</h2>
            <div className="flex items-center">
              {steps.map((s, i) => {
                const done = ticket.status === 'SELESAI' || i <= currentStep;
                const label = { BELUM_DIKONFIRM: 'Dibuat', DISETUJUI: 'Disetujui', AKTIF: 'Check-in', SELESAI: 'Selesai' }[s];
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none last:pr-0">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${ticket.status === s ? 'bg-brand-700 text-white' : done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        {done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px]">{i + 1}</span>}
                      </div>
                      <span className={`text-[9px] mt-1 ${done ? 'text-slate-600' : 'text-slate-400'}`}>{label}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep || ticket.status === 'SELESAI' ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>
            {ticket.status === 'DIBATALKAN' && (
              <div className="mt-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                Reservasi ini telah dibatalkan.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center text-white">
              <QrCode className="w-5 h-5" />
            </div>
            {ticket.qr_code ? (
              <img
                src={ticket.qr_code}
                alt={`QR ${ticket.kode_reservasi}`}
                className="w-44 h-44 object-contain bg-white rounded-xl border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200 text-slate-400 text-xs">
                QR tidak tersedia
              </div>
            )}
            <p className="font-mono text-sm font-bold text-slate-900">{ticket.kode_reservasi}</p>
            <p className="text-[9px] text-slate-400 text-center">
              Tunjukkan QR ini saat check-in
              <br />di coworking space
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <button onClick={() => window.print()} className="w-full inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-3 rounded-xl transition">
              <Printer className="w-4 h-4" /> Cetak E-Ticket
            </button>
          </div>

          <div className="px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center gap-2">
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Nexus • Terima kasih!
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}