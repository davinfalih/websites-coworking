import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  iconClass = "bg-emerald-50 text-emerald-700",
  note,
  footnote,
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  iconClass?: string;
  note?: ReactNode;
  footnote?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_0_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
            {value}
          </span>
          {note && <span className="text-xs font-medium text-slate-500">{note}</span>}
        </div>
        {footnote && <p className="text-xs text-slate-400">{footnote}</p>}
      </div>
      {icon && (
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", iconClass)}>
          {icon}
        </div>
      )}
    </div>
  );
}