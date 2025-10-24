import React from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  characterCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, characterCount, maxLength, value, ...props }, ref) => {
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-ink mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          maxLength={maxLength}
          className={cn(
            'w-full px-3 py-2 rounded-lg border border-border bg-white text-ink',
            'placeholder:text-muted/50',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'disabled:bg-surface disabled:cursor-not-allowed',
            'transition-colors duration-200',
            'resize-y min-h-[100px]',
            error && 'border-error focus:ring-error',
            className
          )}
          {...props}
        />
        <div className="mt-1 flex items-center justify-between">
          <div>
            {error && <p className="text-sm text-error">{error}</p>}
            {hint && !error && <p className="text-sm text-muted">{hint}</p>}
          </div>
          {characterCount && maxLength && (
            <p className="text-sm text-muted">
              {currentLength} / {maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

