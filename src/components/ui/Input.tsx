import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error = false, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full bg-white border-3 rounded px-4 py-3 text-base font-body text-ink
          outline-none transition-all duration-100
          ${error ? "border-coral" : "border-ink"}
          focus:shadow-brutal focus:border-teal
          placeholder:text-ink/40
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
        className={`w-full bg-white border-3 rounded px-4 py-3 text-base font-body text-ink
          outline-none transition-all duration-100 resize-y
          ${error ? "border-coral" : "border-ink"}
          focus:shadow-brutal focus:border-teal
          placeholder:text-ink/40
          ${className}`}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
