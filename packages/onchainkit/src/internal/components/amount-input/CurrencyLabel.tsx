import { cn, text } from '@/styles/theme';
import { ForwardedRef, forwardRef } from 'react';

type CurrencyLabelProps = {
  label: string;
  className?: string;
};

export const CurrencyLabel = forwardRef(
  (
    { label, className }: CurrencyLabelProps,
    ref: ForwardedRef<HTMLSpanElement>,
  ) => {
    return (
      <span
        ref={ref}
        className={cn(
          text.body,
          'text-ock-text-disabled',
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
