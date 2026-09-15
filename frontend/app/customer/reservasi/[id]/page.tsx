// app/customer/reservasi/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Printer, QrCode, MapPin, Clock, Building2, CalendarDays, CheckCircle2 } from 'lucide-react';
import { api, RESERVASI_STATUS_LABEL, formatRupiah, formatDate } from '@/lib/api';
import type { Reservasi } from '@/types';

const statusColors: Record<string, string> = {
  BELUM_DIKONFIRM: 'bg-yellow-100 text-yellow-800',
  DISETUJUI: 'bg-blue-100 text-blue-800',
  AKTIF: 'bg-purple-100 text-purple-800',
  SELESAI: 'bg-green-100 text-green-800',
  DIBATALKAN: 'bg-red-100 text-red-800',
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/customer/reservasi" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-amber-700 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke reservasi
        </Link>
        <button onClick={() => window.print()} className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
          <Printer className="w-4 h-4" /> Cetak
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center text-gray-400 text-sm">Memuat e-ticket...</div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-amber-100 p-12 text-center">
          <p className="text-gray-500">{error}</p>
        </div>
      ) : ticket ? (
        <>
          {/* Header status */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-[#1a120b]">E-Ticket Reservasi</h1>
              <p className="font-mono text-sm text-amber-700 mt-0.5">{ticket.kode_reservasi}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${statusColors[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
              {RESERVASI_STATUS_LABEL[ticket.status] || ticket.status}
            </span>
          </div>

          {/* Container ticket */}
          <div className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-xl shadow-amber-900/8">
            <div className="bg-gradient-to-r from-[#1a0f08] via-amber-900 to-amber-800 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-serif text-white text-lg leading-none">Smart Space Booking</p>
                <p className="text-[9px] text-amber-300/80 tracking-[0.2em] uppercase mt-1">E-Ticket Reservasi</p>
              </div>
              <div
                className="flex items-center gap-2"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z' fill='%23c4944a'/%3E%3C/svg%3E")`,
                  backgroundSize: '16px 16px',
                }}
              >
                <span className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-amber-500/40 font-mono text-xs font-bold text-amber-300">
                  {ticket.kode_reservasi}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px]">
              {/* Detail */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Coworking</p>
                      <p className="text-sm font-medium text-[#1a120b]">{ticket.owner?.nama_coworking || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Lokasi</p>
                      <p className="text-sm font-medium text-[#1a120b]">Jakarta</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Tanggal</p>
                      <p className="text-sm font-medium text-[#1a120b]">{formatDate(ticket.tanggal_reservasi)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">Jam Sewa</p>
                      <p className="text-sm font-medium text-[#1a120b]">{ticket.jam_mulai} - {Number(ticket.jam_mulai.slice(0, 2)) + ticket.durasi_jam}:00 ({ticket.durasi_jam} jam)</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Detail Space</p>
                  {ticket.details?.map((d) => (
                    <div key={d.id} className="flex items-center justify-between py-3 border-b border-amber-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[#1a120b]">{d.space?.nama_space || '-'}</p>
                        <p className="text-xs text-gray-400">
                          {d.space?.tipe ? { DESK: 'Personal Desk', MEETING_ROOM: 'Meeting Room', PRIVATE_OFFICE: 'Private Office' }[d.space.tipe] : ''}
                          {d.space?.kapasitas ? ` • Kap. ${d.space.kapasitas}` : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-amber-700">{formatRupiah(d.total_harga)}</p>
                        {d.diskon && (
                          <p className="text-[10px] text-red-500">Diskon {d.diskon.kode_diskon} ({d.diskon.persentase_diskon}%)</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-3">Status Proses</p>
                  <div className="flex items-center">
                    {steps.map((s, i) => {
                      const done = ticket.status === 'SELESAI' || i <= currentStep;
                      const label = { BELUM_DIKONFIRM: 'Dibuat', DISETUJUI: 'Disetujui', AKTIF: 'Check-in', SELESAI: 'Selesai' }[s];
                      return (
                        <div key={s} className="flex items-center flex-1 last:flex-none last:pr-0">
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${ticket.status === s ? 'bg-amber-600 text-white' : done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                              {done ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px]">{i + 1}</span>}
                            </div>
                            <span className={`text-[9px] mt-1 ${done ? 'text-gray-600' : 'text-gray-400'}`}>{label}</span>
                          </div>
                          {i < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep || ticket.status === 'SELESAI' ? 'bg-green-400' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {ticket.status === 'DIBATALKAN' && (
                    <div className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      Reservasi ini telah dibatalkan.
                    </div>
                  )}
                </div>
              </div>

              {/* QR Side */}
              <div className="md:border-l border-amber-50 bg-gradient-to-br from-[#faf6f0] to-amber-50/50 flex flex-col items-center justify-center p-6 gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1a0f08] flex items-center justify-center text-amber-400">
                  <QrCode className="w-5 h-5" />
                </div>
                {ticket.qr_code ? (
                  <img
                    src={ticket.qr_code}
                    alt={`QR ${ticket.kode_reservasi}`}
                    className="w-44 h-44 object-contain bg-white rounded-xl border border-amber-100 shadow-md"
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-white rounded-xl border border-amber-100 text-gray-400 text-xs">
                    QR tidak tersedia
                  </div>
                )}
                <p className="font-mono text-sm font-bold text-[#1a120b]">{ticket.kode_reservasi}</p>
                <p className="text-[9px] text-gray-400 text-center">
                  Tunjukkan QR ini saat check-in
                  <br />di coworking space
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-[#faf6f0] border-t border-amber-50 flex items-center justify-center gap-2">
              <p className="text-[11px] text-gray-400">
                © {new Date().getFullYear()} Smart Space Booking • Terima kasih!
              </p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}