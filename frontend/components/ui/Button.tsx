import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-emerald-700 text-white shadow-sm hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500/30 active:scale-[0.99]",
  secondary:
    "bg-slate-200/80 text-slate-900 shadow-sm hover:bg-slate-300/70 focus-visible:ring-2 focus-visible:ring-slate-400/30 active:scale-[0.99]",
  outline:
    "bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-emerald-500/20 active:scale-[0.99]",
  ghost:
    "text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-400/30",
  destructive:
    "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-400/30 active:scale-[0.99]",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500/30 active:scale-[0.99]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6",
  icon: "h-9 w-9",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
  }
>(function Button({ className, variant = "primary", size = "md", type = "button", ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});