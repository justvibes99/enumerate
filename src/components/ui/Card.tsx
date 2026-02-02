import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accentColor?: string;
  accentPosition?: "left" | "top";
  hoverable?: boolean;
  children: ReactNode;
}

export function Card({
  accentColor,
  accentPosition = "left",
  hoverable = false,
  children,
  className = "",
  style,
  ...props
}: CardProps) {
  const accentStyle = accentColor
    ? {
        ...style,
        [`border${accentPosition === "left" ? "Left" : "Top"}Width`]: "3px",
        [`border${accentPosition === "left" ? "Left" : "Top"}Color`]: accentColor,
      }
    : style;

  return (
    <div
      className={`bg-surface-raised border border-border shadow-md rounded-[var(--radius)] p-4
        ${hoverable ? "transition-all duration-150 cursor-pointer hover:shadow-lg" : ""}
        ${className}`}
      style={accentStyle}
      {...props}
    >
      {children}
    </div>
  );
}
