import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const labelColors = {
  yellow: "bg-yellow",
  cyan: "bg-cyan",
  pink: "bg-pink",
  purple: "bg-purple text-white",
  green: "bg-green",
} as const;

type SectionLabelColor = keyof typeof labelColors;

type SectionLabelProps = HTMLAttributes<HTMLSpanElement> & {
  color?: SectionLabelColor;
};

export function SectionLabel({
  className,
  color = "yellow",
  ...props
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-sm)] border-2 border-border px-4 py-2 text-xs font-black uppercase shadow-[var(--shadow-hard-sm)]",
        labelColors[color],
        className,
      )}
      {...props}
    />
  );
}
