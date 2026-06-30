import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium text-(--color-foreground)">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`rounded-lg border border-(--color-border) bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-(--color-danger) focus:ring-(--color-danger)" : ""
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-(--color-danger)">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
