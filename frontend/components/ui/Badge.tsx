import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-blue-50 text-blue-800 border-blue-200",
  active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  brand: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const DOTS: Record<string, string> = {
  pending: "bg-amber-500",
  approved: "bg-blue-600",
  active: "bg-emerald-500",
  cancelled: "bg-red-500",
  neutral: "bg-slate-400",
  brand: "bg-emerald-500",
};

const STATUS_KIND: Record<string, string> = {
  BELUM_DIKONFIRM: "pending",
  DISETUJUI: "approved",
  AKTIF: "active",
  SELESAI: "active",
  DIBATALKAN: "cancelled",
};

export function Badge({
  children,
  kind = "neutral",
  dot,
  className,
}: {
  children: ReactNode;
  kind?: keyof typeof STYLES;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium",
        STYLES[kind],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", DOTS[kind])} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }: { status?: string | null; className?: string }) {
  if (!status) return <Badge kind="neutral" className={className}>-</Badge>;
  const kind = STATUS_KIND[status] || "neutral";
  return (
    <Badge kind={kind} dot className={className}>
      {status.replaceAll("_", " ")}
    </Badge>
  );
}

export function TypePill({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center gap-1 rounded-md bg-slate-100 px-2 text-xs font-medium text-slate-700">
      {icon}
      {children}
    </span>
  );
}