import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-3 py-2 rounded-lg border border-border bg-white text-ink',
              'placeholder:text-muted/50',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'disabled:bg-surface disabled:cursor-not-allowed',
              'transition-colors duration-200',
              error && 'border-error focus:ring-error',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-sm text-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

