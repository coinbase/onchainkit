import { type ForwardedRef, forwardRef } from 'react';
import { caretUpSvg } from '../../internal/svg/caretUpSvg';
import { border, cn, color, pressable, text } from '../../styles/theme';
import type { FundCardPaymentMethodSelectorTogglePropsReact } from '../types';
import { FundCardPaymentMethodImage } from './FundCardPaymentMethodImage';

export const FundCardPaymentMethodSelectorToggle = forwardRef(
  (
    {
      onClick,
      paymentMethod,
      isOpen,
      className,
    }: FundCardPaymentMethodSelectorTogglePropsReact,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <button
        type="button"
        className={cn(
          pressable.default,
          border.radius,
          border.lineDefault,
          'flex h-12 w-full items-center gap-2 px-3 py-1',
          className,
        )}
        onClick={onClick}
        ref={ref}
        data-testid="ockFundCardPaymentMethodSelectorToggle"
      >
        <div className="w-4">
          <FundCardPaymentMethodImage
            paymentMethod={paymentMethod}
            className="h-4 w-4"
          />
        </div>
        <span
          className={cn(text.headline, color.foreground, 'flex w-full')}
          data-testid="ockFundCardPaymentMethodSelectorToggle__paymentMethodName"
        >
          {paymentMethod.name}
        </span>

        <span
          className={cn(
            'rotate-90 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
        >
          {caretUpSvg}
        </span>
      </button>
    );
  },
);

FundCardPaymentMethodSelectorToggle.displayName =
  'FundCardPaymentMethodSelectorToggle';
