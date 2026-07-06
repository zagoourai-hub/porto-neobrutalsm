import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BrutalTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function BrutalTextarea({ className, ...props }: BrutalTextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full resize-y rounded-[var(--radius-sm)] border-2 border-border bg-surface px-4 py-3 text-sm font-semibold shadow-[2px_2px_0_var(--color-border)] transition focus:border-purple focus:shadow-[4px_4px_0_var(--color-border)] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
