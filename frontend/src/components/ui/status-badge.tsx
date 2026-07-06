import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeColors = {
  gray: "bg-gray-100 text-ink",
  yellow: "bg-yellow text-ink",
  cyan: "bg-cyan text-ink",
  pink: "bg-pink text-ink",
  purple: "bg-purple text-white",
  green: "bg-green text-ink",
  red: "bg-red text-white",
} as const;

type StatusBadgeColor = keyof typeof badgeColors;

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  color?: StatusBadgeColor;
};

export function StatusBadge({
  className,
  color = "gray",
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--radius-sm)] border-2 border-border px-3 py-1.5 text-[11px] font-black uppercase shadow-[2px_2px_0_var(--color-border)]",
        badgeColors[color],
        className,
      )}
      {...props}
    />
  );
}
