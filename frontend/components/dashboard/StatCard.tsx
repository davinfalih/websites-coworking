'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeType?: 'increase' | 'decrease';
}

export const StatCard = ({ title, value, icon, change, changeType }: StatCardProps) => (
  <div className="bg-white rounded-xl p-5 border border-amber-100 hover:shadow-lg hover:shadow-amber-900/8 hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
        {icon}
      </div>
      {change && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {changeType === 'increase' ? '+' : '-'}{change}%
        </span>
      )}
    </div>
    <p className="text-2xl font-serif font-bold text-[#1a120b]">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
  </div>
);