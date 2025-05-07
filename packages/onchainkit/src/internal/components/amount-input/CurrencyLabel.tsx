import { cn, text } from '@/styles/theme';
import { Ref } from 'react';

type CurrencyLabelProps = {
  label: string;
  className?: string;
  ref?: Ref<HTMLSpanElement>;
};

export const CurrencyLabel = ({
  label,
  className,
  ref,
}: CurrencyLabelProps) => {
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
};

CurrencyLabel.displayName = 'CurrencyLabel';
