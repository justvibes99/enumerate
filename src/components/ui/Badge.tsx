import type { ReactNode } from "react";

interface BadgeProps {
  color?: "success" | "warning" | "error" | "info" | "neutral";
  children: ReactNode;
  className?: string;
}

const colorClasses = {
  success: "bg-success-light text-success",
  warning: "bg-warning-light text-warning",
  error: "bg-error-light text-error",
  info: "bg-info-light text-info",
  neutral: "bg-surface-sunken text-text-secondary",
};

export function Badge({ color = "success", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-[var(--radius-sm)] px-2.5 py-0.5
        text-xs font-body font-semibold
        ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}
