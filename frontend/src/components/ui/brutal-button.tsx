import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary: "bg-yellow text-ink",
  secondary: "bg-surface text-ink",
  danger: "bg-surface text-red border-red",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

type CommonButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type NativeButtonProps = CommonButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorButtonProps = CommonButtonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type BrutalButtonProps = NativeButtonProps | AnchorButtonProps;

const baseClassName =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 border-border px-5 py-3 text-sm font-black uppercase shadow-[var(--shadow-hard-sm)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-border)]";

export function BrutalButton(props: BrutalButtonProps) {
  if ("href" in props && props.href !== undefined) {
    const {
      children,
      className,
      href,
      variant = "primary",
      ...anchorProps
    } = props;
    const composedClassName = cn(
      baseClassName,
      buttonVariants[variant],
      className,
    );

    return (
      <a href={href} className={composedClassName} {...anchorProps}>
        {children}
      </a>
    );
  }

  const {
    children,
    className,
    type,
    variant = "primary",
    ...buttonProps
  } = props;
  const composedClassName = cn(baseClassName, buttonVariants[variant], className);
  const buttonType: ButtonHTMLAttributes<HTMLButtonElement>["type"] =
    type ?? "button";

  return (
    <button type={buttonType} className={composedClassName} {...buttonProps}>
      {children}
    </button>
  );
}
