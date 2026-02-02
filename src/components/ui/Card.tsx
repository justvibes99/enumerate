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
        [`border${accentPosition === "left" ? "Left" : "Top"}Width`]: "4px",
        [`border${accentPosition === "left" ? "Left" : "Top"}Color`]: accentColor,
      }
    : style;

  return (
    <div
      className={`bg-cream border-3 border-ink shadow-brutal-lg rounded p-6
        ${hoverable ? "transition-all duration-100 cursor-pointer hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none" : ""}
        ${className}`}
      style={accentStyle}
      {...props}
    >
      {children}
    </div>
  );
}
