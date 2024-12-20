import { memo } from 'react';
import { border, cn, color, pressable, text } from '../../styles/theme';
import type { FundCardPaymentMethodSelectRowPropsReact } from '../types';
import { FundCardPaymentMethodImage } from './FundCardPaymentMethodImage';

export const FundCardPaymentMethodSelectRow = memo(
  ({
    className,
    paymentMethod,
    onClick,
    hideImage,
    hideDescription,
  }: FundCardPaymentMethodSelectRowPropsReact) => {
    return (
      <button
        data-testid="ockFundCardPaymentMethodSelectRow__button"
        type="button"
        className={cn(
          pressable.default,
          border.radius,
          'flex w-full items-center justify-between px-2 py-1',
          className,
        )}
        onClick={() => onClick?.(paymentMethod)}
      >
        <span className="flex items-center gap-3">
          {!hideImage && (
            <FundCardPaymentMethodImage paymentMethod={paymentMethod} />
          )}
          <span className="flex flex-col items-start">
            <span className={cn(text.headline)}>{paymentMethod.name}</span>
            {!hideDescription && (
              <span className={cn(text.body, color.foregroundMuted)}>
                {paymentMethod.description}
              </span>
            )}
          </span>
        </span>
      </button>
    );
  },
);
