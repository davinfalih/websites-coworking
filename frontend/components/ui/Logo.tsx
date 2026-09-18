import { cn } from "@/lib/utils";

export function NexusMark({
  className,
}: {
  className?: string;
}) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id="nx-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#059669" />
          <stop offset="0.55" stopColor="#0d9488" />
          <stop offset="1" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="nx-node" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ee7b7" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill="url(#nx-bg)" />
      <rect x="2" y="2" width="44" height="44" rx="13" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      <path d="M15 15h18v18H15z" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      <path
        d="M15 19.5h18M15 24h18M15 28.5h18M19.5 15v18M24 15v18M28.5 15v18"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="1"
      />
      <path
        d="M15 15 24 24M33 15 24 24M15 33 24 24M33 33 24 24"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1"
      />
      <circle cx="15" cy="15" r="2.3" fill="url(#nx-node)" />
      <circle cx="33" cy="15" r="2.3" fill="url(#nx-node)" />
      <circle cx="15" cy="33" r="2.3" fill="url(#nx-node)" />
      <circle cx="33" cy="33" r="2.3" fill="url(#nx-node)" />
      <circle cx="24" cy="24" r="5" fill="#ffffff" />
      <circle cx="24" cy="24" r="2.6" fill="url(#nx-bg)" />
      <path d="M36.5 6.2 38 9.6l3.4 1.5-3.4 1.5-1.5 3.4-1.5-3.4-3.4-1.5 3.4-1.5z" fill="#a7f3d0" opacity="0.95" />
    </svg>
  );
}

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
      <NexusMark
        className={size === "sm" ? "h-8 w-8" : size === "lg" ? "h-11 w-11" : "h-9 w-9"}
      />
      <div className="leading-none">
        <p
          className={cn(
            "font-semibold tracking-tight",
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