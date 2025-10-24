import React from 'react';
import { cn } from '../../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  hint?: string;
  options: readonly SelectOption[] | SelectOption[];
  onChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          onChange={handleChange}
          className={cn(
            'w-full px-3 py-2 rounded-lg border border-border bg-white text-ink',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:bg-surface disabled:cursor-not-allowed',
            'transition-colors duration-200',
            error && 'border-error focus:ring-error',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';

