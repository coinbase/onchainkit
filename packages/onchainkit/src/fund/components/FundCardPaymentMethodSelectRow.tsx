import { memo, useCallback } from 'react';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { FundEvent } from '../../core/analytics/types';
import { cn, pressable, text } from '../../styles/theme';
import type { FundCardPaymentMethodSelectRowProps } from '../types';
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
  }: FundCardPaymentMethodSelectRowProps) => {
    const { sendAnalytics } = useAnalytics();

    const handleOnClick = useCallback(() => {
      if (!disabled) {
        onClick?.(paymentMethod);
        sendAnalytics(FundEvent.FundOptionSelected, {
          option: paymentMethod.id,
        });
      }
    }, [disabled, onClick, paymentMethod, sendAnalytics]);

    return (
      <button
        data-testid={testId}
        type="button"
        className={cn(
          pressable.default,
          'bg-ock-bg-default',
          'rounded-ock-default flex w-full items-center justify-between px-4 py-2',
          {
            [pressable.disabled]: disabled,
          },
        )}
        onClick={handleOnClick}
        disabled={disabled}
        title={disabledReason}
      >
        <span className="flex items-center gap-3">
          {!hideImage && (
            <FundCardPaymentMethodImage
              paymentMethod={paymentMethod}
              className={cn('h-4 w-4', {
                [pressable.disabled]: disabled,
              })}
            />
          )}
          <span className="flex flex-col items-start">
            <span className={cn(text.headline)}>{paymentMethod.name}</span>
            {!hideDescription && (
              <span
                className={cn(
                  text.label2,
                  'text-ock-text-foreground-muted',
                  'font-normal',
                )}
              >
                {disabledReason || paymentMethod.description}
              </span>
            )}
          </span>
        </span>
      </button>
    );
  },
);

FundCardPaymentMethodSelectRow.displayName = 'FundCardPaymentMethodSelectRow';
