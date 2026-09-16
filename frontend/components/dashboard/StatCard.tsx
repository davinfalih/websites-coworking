'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

export const StatCard = ({ title, value, icon, change, changeType }: StatCardProps) => (
  <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-700">
        {icon}
      </div>
      {change && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          changeType === 'increase' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
        }`}>
          {changeType === 'increase' ? '+' : '-'}{change}%
        </span>
      )}
    </div>
    <p className="text-2xl font-semibold text-slate-900 tabular-nums">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
  </div>
);