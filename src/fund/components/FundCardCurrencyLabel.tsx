import { forwardRef } from 'react';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { cn, text } from '../../styles/theme';
import type { FundCardCurrencyLabelPropsReact } from '../types';

export const FundCardCurrencyLabel = forwardRef<
  HTMLSpanElement,
  FundCardCurrencyLabelPropsReact
>(({ currencySign }, ref) => {
  const componentTheme = useTheme();

  return (
    <span
      ref={ref}
      className={cn(
        componentTheme,
        text.body,
        'flex items-center justify-center bg-transparent',
        'text-[60px] leading-none outline-none'
      )}
      data-testid="currencySpan"
    >
      {currencySign}
    </span>
  );
});
