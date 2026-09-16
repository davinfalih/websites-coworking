// app/admin/reports/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Wallet, CheckCircle2, TrendingUp, Building2 } from 'lucide-react';
import { createClient, formatRupiah, SPACE_TYPE_LABEL } from '@/lib/api';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import type { DashboardSummary, RevenueMonthRow, RevenueSpaceTypeRow } from '@/types';

const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function AdminReportsPage() {
  const client = createClient();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthly, setMonthly] = useState<RevenueMonthRow[]>([]);
  const [byType, setByType] = useState<RevenueSpaceTypeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, m, t] = await Promise.all([
        client.getDashboardSummary(),
        client.getRevenueByMonth(),
        client.getRevenueBySpaceType(),
      ]);
      setSummary(s);
      setMonthly(m || []);
      setByType(t || []);
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat laporan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const chartData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const buckets = monthly.filter((r) => {
      const year = Number(r.bulan.slice(0, 4));
      return year === currentYear || monthly.length <= 12;
    });
    if (buckets.length === 0) {
      return MONTHS_ID.map((m) => ({ day: m, count: 0 }));
    }
    return MONTHS_ID.map((m, i) => {
      const key = `${String(i + 1).padStart(2, '0')}`;
      const found = buckets.find((r) => r.bulan.split('-')[1] === key);
      return { day: m, count: found ? found.jumlah_reservasi : 0 };
    });
  }, [monthly]);

  const maxType = Math.max(...byType.map((t) => t.pendapatan), 1);

  // Status distribusi
  const statusEntries = Object.entries(summary?.status || {});

  if (loading) {
    return <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-gray-400 text-sm">Memuat laporan...</div>;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
        <p className="text-gray-500 text-sm">{error}</p>
        <button onClick={load} className="mt-4 text-emerald-700 font-semibold text-sm hover:underline">
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Laporan & Statistik</h1>
          <p className="text-sm text-slate-500 mt-1">Ringkasan performa reservasi coworking space.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Reservasi" value={summary?.total_reservasi ?? 0} icon={<CalendarClock className="w-5 h-5" />} />
        <StatCard title="Total Pendapatan" value={formatRupiah(summary?.total_pendapatan ?? 0)} icon={<Wallet className="w-5 h-5" />} />
        <StatCard title="Reservasi Selesai" value={summary?.status?.SELESAI ?? 0} icon={<CheckCircle2 className="w-5 h-5" />} />
        <StatCard title="Jumlah Bulan Aktif" value={monthly.length} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      {/* Chart + status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={chartData} title="Reservasi per Bulan" />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 text-lg mb-4">Distribusi Status</h3>
          {statusEntries.length === 0 ? (
            <p className="text-sm text-gray-400 py-6 text-center">Belum ada data</p>
          ) : (
            <div className="space-y-4">
              {statusEntries.map(([key, value]) => {
                const total = summary?.total_reservasi || 1;
                const pct = Math.round((value / total) * 100);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-900">
                        {{
                          BELUM_DIKONFIRM: 'Belum Dikonfirmasi',
                          DISETUJUI: 'Disetujui',
                          AKTIF: 'Aktif',
                          SELESAI: 'Selesai',
                          DIBATALKAN: 'Dibatalkan',
                        }[key] || key}
                      </span>
                      <span className="text-gray-400">
                        {value} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Revenue by type */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900 text-lg mb-4">Pendapatan per Tipe Space</h3>
        {byType.length === 0 ? (
          <p className="text-sm text-gray-400 py-6 text-center">Belum ada data</p>
        ) : (
          <div className="space-y-5">
            {byType.map((t) => (
              <div key={t.tipe}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2 font-medium text-slate-900">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    {SPACE_TYPE_LABEL[t.tipe] || t.label || t.tipe}
                  </span>
                  <span className="text-gray-500">
                    {formatRupiah(t.pendapatan)} • {t.jumlah} reservasi
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-500" style={{ width: `${Math.max((t.pendapatan / maxType) * 100, 3)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue per month table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 text-lg">Rincian Pendapatan per Bulan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Bulan</th>
                <th className="px-5 py-3.5">Jumlah Reservasi</th>
                <th className="px-5 py-3.5 text-right">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {monthly.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-gray-400">Belum ada data</td>
                </tr>
              ) : (
                monthly.map((r) => {
                  const [y, m] = r.bulan.split('-');
                  const monthLabel = `${MONTHS_ID[Number(m) - 1] || m} ${y}`;
                  return (
                    <tr key={r.bulan} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="px-5 py-4 font-medium text-slate-900">{monthLabel}</td>
                      <td className="px-5 py-4 text-gray-500">{r.jumlah_reservasi}</td>
                      <td className="px-5 py-4 text-right font-bold text-emerald-700">{formatRupiah(r.pendapatan)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}