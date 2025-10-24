import React from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, ...props }, ref) => {
    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'mt-1 h-4 w-4 rounded border-border text-primary',
            'focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors duration-200',
            className
          )}
          {...props}
        />
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label className="block text-sm font-medium text-ink cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-muted mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

