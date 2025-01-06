import { forwardRef } from 'react';
import { cn, text } from '../../styles/theme';
import type { FundCardCurrencyLabelPropsReact } from '../types';

export const FundCardCurrencyLabel = forwardRef<
  HTMLSpanElement,
  FundCardCurrencyLabelPropsReact
>(({ currencySign }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        text.body,
        'flex items-center justify-center bg-transparent',
        'text-6xl leading-none outline-none',
      )}
      data-testid="currencySpan"
    >
      {currencySign}
    </span>
  );
});
