import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BrutalInputProps = InputHTMLAttributes<HTMLInputElement>;

export function BrutalInput({ className, ...props }: BrutalInputProps) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-[var(--radius-sm)] border-2 border-border bg-surface px-4 py-3 text-sm font-semibold shadow-[2px_2px_0_var(--color-border)] transition focus:border-purple focus:shadow-[4px_4px_0_var(--color-border)] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
