import { cn, color, text } from '@/styles/theme';
import { forwardRef } from 'react';

type CurrencyLabelProps = {
  label: string;
  className?: string;
};

export const CurrencyLabel = forwardRef<HTMLSpanElement, CurrencyLabelProps>(
  ({ label, className }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          text.body,
          color.disabled,
          'flex items-center justify-center bg-transparent',
          'text-6xl leading-none outline-none',
          className,
        )}
        data-testid="ockCurrencySpan"
      >
        {label}
      </span>
    );
  },
);

CurrencyLabel.displayName = 'CurrencyLabel';
