import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ── Button ──────────────────────────────────── */
type Variant = "primary" | "weak" | "dark" | "danger" | "ghost";
type Size = "lg" | "md" | "sm";

const variantClass: Record<Variant, string> = {
  primary: "bg-brand text-white active:bg-brand-hover",
  weak: "bg-brand-light text-brand-hover active:brightness-95",
  dark: "bg-ink-soft text-white active:brightness-110",
  danger: "bg-danger text-white active:brightness-95",
  ghost: "bg-transparent text-muted active:bg-surface",
};

const sizeClass: Record<Size, string> = {
  lg: "h-14 text-[17px] rounded-2xl px-5",
  md: "h-12 text-[15px] rounded-xl px-4",
  sm: "h-9 text-[13px] rounded-lg px-3",
};

function buttonClasses(variant: Variant, size: Size, block: boolean) {
  return cn(
    "inline-flex items-center justify-center gap-1.5 font-semibold transition select-none",
    "disabled:opacity-40 disabled:pointer-events-none",
    variantClass[variant],
    sizeClass[size],
    block && "w-full",
  );
}

export function Button({
  variant = "primary",
  size = "lg",
  block = false,
  className,
  ...props
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}) {
  return (
    <button
      className={cn(buttonClasses(variant, size, block), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "lg",
  block = false,
  className,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}) {
  return (
    <Link
      className={cn(buttonClasses(variant, size, block), className)}
      {...props}
    />
  );
}

/* ── Field / TextField / Textarea ────────────── */
export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-ink-soft">{label}</span>
      {children}
      {error ? (
        <span className="text-[13px] text-danger">{error}</span>
      ) : hint ? (
        <span className="text-[13px] text-caption">{hint}</span>
      ) : null}
    </label>
  );
}

const fieldBase =
  "w-full bg-[rgba(0,23,51,0.02)] text-ink-strong placeholder:text-placeholder " +
  "border border-line rounded-[14px] px-4 py-3.5 text-[16px] outline-none " +
  "focus:border-brand transition";

export function TextField({
  error,
  className,
  ...props
}: ComponentProps<"input"> & { error?: boolean }) {
  return (
    <input
      className={cn(fieldBase, error && "border-danger focus:border-danger", className)}
      {...props}
    />
  );
}

export function Textarea({
  error,
  className,
  ...props
}: ComponentProps<"textarea"> & { error?: boolean }) {
  return (
    <textarea
      className={cn(
        fieldBase,
        "min-h-32 resize-none leading-relaxed",
        error && "border-danger focus:border-danger",
        className,
      )}
      {...props}
    />
  );
}

/* ── Card ────────────────────────────────────── */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("bg-bg rounded-card p-5 shadow-card", className)}>
      {children}
    </div>
  );
}

/* ── Badge ───────────────────────────────────── */
type BadgeTone = "brand" | "success" | "info" | "neutral" | "warning";
const badgeTone: Record<BadgeTone, string> = {
  brand: "bg-brand-light text-brand-hover",
  success: "bg-[rgba(3,178,108,0.12)] text-success",
  info: "bg-[rgba(24,165,165,0.12)] text-info",
  warning: "bg-[rgba(254,152,0,0.14)] text-warning",
  neutral: "bg-[rgba(2,32,71,0.05)] text-ink-soft",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[10px] px-2 py-1 text-[12px] font-bold",
        badgeTone[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── EmptyState ──────────────────────────────── */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      {icon ? <div className="text-placeholder">{icon}</div> : null}
      <p className="text-[15px] font-medium text-ink-soft">{title}</p>
      {description ? (
        <p className="max-w-xs text-[13px] leading-relaxed text-caption">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
