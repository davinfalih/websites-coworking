"use client";
import { useEffect, useRef } from "react";
import { motion, useInView, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const NumberTicker = ({
  value,
  direction = "up",
  delay = 0,
  className,
  decimals = 0,
}: {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  decimals?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [scope] = useAnimate();
  const isInView = useInView(scope, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    const start = direction === "down" ? value : 0;
    const end = direction === "down" ? 0 : value;
    const totalDuration = 2;
    const startTime = performance.now() + delay * 1000;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      if (elapsed < 0) {
        requestAnimationFrame(updateCount);
        return;
      }
      const progress = Math.min(elapsed / (totalDuration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);

      if (ref.current) {
        ref.current.textContent = current.toLocaleString("id-ID", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        });
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, value, direction, delay, decimals]);

  return (
    <motion.span ref={scope} className={cn("inline-block tabular-nums", className)}>
      <span ref={ref}>0</span>
    </motion.span>
  );
};