import { cn } from "@/lib/utils";

export function Logo({
  dark = false,
  size = "md",
  className,
}: {
  dark?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm",
          size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-9 w-9",
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className={size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"}>
          <path d="M4 20V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v13H4Z" fill="currentColor" opacity="0.35" />
          <path d="M2 20h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M8 20v-8m4 8V6m4 14v-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="18.5" cy="4.5" r="2.2" fill="#10B981" />
        </svg>
      </div>
      <div className="leading-none">
        <p
          className={cn(
            "font-semibold tracking-tight text-slate-900",
            dark ? "text-white" : "text-slate-900",
            size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-lg",
          )}
        >
          Nexus
        </p>
        <p
          className={cn(
            "mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
            dark ? "text-emerald-200/70" : "text-slate-500",
          )}
        >
          Workstation &amp; Booking
        </p>
      </div>
    </div>
  );
}