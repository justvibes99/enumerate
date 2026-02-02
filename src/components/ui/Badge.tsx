import type { ReactNode } from "react";

interface BadgeProps {
  color?: "mint" | "teal" | "yellow" | "coral" | "lavender" | "cream";
  children: ReactNode;
  className?: string;
}

const colorClasses = {
  mint: "bg-mint",
  teal: "bg-teal",
  yellow: "bg-yellow",
  coral: "bg-coral",
  lavender: "bg-lavender",
  cream: "bg-cream",
};

export function Badge({ color = "mint", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-block border-2 border-ink rounded px-2 py-0.5
        text-xs font-heading font-bold uppercase tracking-wider text-ink
        ${colorClasses[color]} ${className}`}
    >
      {children}
    </span>
  );
}
