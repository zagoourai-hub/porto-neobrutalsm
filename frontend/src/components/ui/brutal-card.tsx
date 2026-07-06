import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const cardVariants = {
  default: "bg-surface",
  yellow: "bg-yellow",
  cyan: "bg-cyan",
  pink: "bg-pink",
  purple: "bg-purple text-white",
  success: "bg-green",
  danger: "bg-red text-white",
} as const;

type BrutalCardVariant = keyof typeof cardVariants;

type BrutalCardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: BrutalCardVariant;
};

export function BrutalCard({
  className,
  variant = "default",
  ...props
}: BrutalCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border-2 border-border shadow-[var(--shadow-hard-md)]",
        cardVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
