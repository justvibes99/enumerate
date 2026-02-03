import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: ReactNode;
}

const variantClasses = {
  primary:
    "bg-primary text-white border border-primary hover:bg-primary-hover hover:shadow-md active:scale-[0.98]",
  secondary:
    "bg-surface-raised text-text-primary border border-border hover:border-border-strong hover:shadow-md active:scale-[0.98]",
  danger:
    "bg-error text-white border border-error hover:bg-error/90 hover:shadow-md active:scale-[0.98]",
  success:
    "bg-success text-white border border-success hover:bg-success/90 hover:shadow-md active:scale-[0.98]",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`font-body font-semibold rounded-[var(--radius-sm)] transition-all duration-150 cursor-pointer shadow-sm
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed shadow-sm" : ""}
        ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
