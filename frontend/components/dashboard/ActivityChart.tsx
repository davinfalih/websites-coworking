'use client';

interface ActivityData {
  day: string;
  count: number;
}

interface ActivityChartProps {
  data: ActivityData[];
  title?: string;
}

export const ActivityChart = ({ data, title = 'Aktivitas Mingguan' }: ActivityChartProps) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-900 text-lg mb-4">{title}</h3>
      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((item) => (
          <div key={item.day} className="flex flex-col items-center flex-1 gap-2">
            <span className="text-[10px] text-gray-400 font-medium">{item.count}</span>
            <div className="w-full max-w-[32px] bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-lg transition-all duration-300 hover:from-emerald-700 hover:to-emerald-500"
              style={{ height: `${Math.max((item.count / maxCount) * 100, 4)}%` }}
            />
            <span className="text-[10px] text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};