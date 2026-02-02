import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full bg-surface-sunken border rounded-[var(--radius-sm)] px-4 py-3 text-base font-body text-text-primary
          outline-none transition-all duration-150
          ${error ? "border-error" : "border-border"}
          focus:shadow-focus focus:border-primary
          placeholder:text-text-tertiary
          ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full bg-surface-sunken border rounded-[var(--radius-sm)] px-4 py-3 text-base font-body text-text-primary
          outline-none transition-all duration-150 resize-y
          ${error ? "border-error" : "border-border"}
          focus:shadow-focus focus:border-primary
          placeholder:text-text-tertiary
          ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
