import { forwardRef } from 'react';
import { cn, color, text } from '../../styles/theme';
import type { FundCardCurrencyLabelPropsReact } from '../types';

export const FundCardCurrencyLabel = forwardRef<
  HTMLSpanElement,
  FundCardCurrencyLabelPropsReact
>(({ label }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        text.body,
        color.disabled,
        'flex items-center justify-center bg-transparent',
        'text-6xl leading-none outline-none',
      )}
      data-testid="ockCurrencySpan"
    >
      {label}
    </span>
  );
});
