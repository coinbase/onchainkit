import { memo, useCallback } from 'react';
import {
  background,
  border,
  cn,
  color,
  pressable,
  text,
} from '../../styles/theme';
import type { FundCardPaymentMethodSelectRowPropsReact } from '../types';
import { FundCardPaymentMethodImage } from './FundCardPaymentMethodImage';

export const FundCardPaymentMethodSelectRow = memo(
  ({
    paymentMethod,
    onClick,
    hideImage,
    hideDescription,
    disabled,
    disabledReason,
    testId,
  }: FundCardPaymentMethodSelectRowPropsReact) => {
    const handleOnClick = useCallback(
      () => !disabled && onClick?.(paymentMethod),
      [disabled, onClick, paymentMethod],
    );

    return (
      <button
        data-testid={testId}
        type="button"
        className={cn(
          pressable.default,
          border.radius,
          background.inverse,
          'flex w-full items-center justify-between px-4 py-2',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onClick={handleOnClick}
        disabled={disabled}
        title={disabledReason}
      >
        <span className="flex items-center gap-3">
          {!hideImage && (
            <FundCardPaymentMethodImage
              paymentMethod={paymentMethod}
              className={cn('h-4 w-4', disabled && 'opacity-50')}
            />
          )}
          <span className="flex flex-col items-start">
            <span className={cn(text.headline)}>{paymentMethod.name}</span>
            {!hideDescription && (
              <span className={cn(text.body, color.foregroundMuted)}>
                {disabledReason || paymentMethod.description}
              </span>
            )}
          </span>
        </span>
      </button>
    );
  },
);
