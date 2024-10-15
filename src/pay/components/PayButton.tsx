import { useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { useIcon } from '../../internal/hooks/useIcon';
import { cn, color, pressable, text as styleText } from '../../styles/theme';
import { PAY_LIFECYCLESTATUS } from '../constants';
import type { PayButtonReact } from '../types';
import { usePayContext } from './PayProvider';

export function PayButton({
  className,
  coinbaseBranded,
  disabled,
  icon,
  text = 'Pay',
}: PayButtonReact) {
  if (coinbaseBranded) {
    icon = 'coinbasePay';
    text = 'Pay with Crypto';
  }
  const { lifecycleStatus, onSubmit } = usePayContext();
  const iconSvg = useIcon({ icon });

  const isLoading = lifecycleStatus?.statusName === PAY_LIFECYCLESTATUS.PENDING;
  const isFetchingData =
    lifecycleStatus?.statusName === PAY_LIFECYCLESTATUS.FETCHING_DATA;
  const isDisabled = disabled || isLoading || isFetchingData;
  const buttonText = useMemo(() => {
    if (lifecycleStatus?.statusName === PAY_LIFECYCLESTATUS.SUCCESS) {
      return 'View payment details';
    }
    if (
      lifecycleStatus?.statusName === PAY_LIFECYCLESTATUS.ERROR &&
      lifecycleStatus?.statusData.error === 'User has insufficient balance'
    ) {
      return 'Get USDC';
    }
    return text;
  }, [lifecycleStatus?.statusName, lifecycleStatus?.statusData, text]);
  const shouldRenderIcon = buttonText === text && iconSvg;

  return (
    <button
      className={cn(
        coinbaseBranded ? pressable.coinbaseBranding : pressable.primary,
        'w-full rounded-xl',
        'mt-4 px-4 py-3 font-medium text-base text-white leading-6',
        isDisabled && pressable.disabled,
        styleText.headline,
        className,
      )}
      onClick={onSubmit}
      type="button"
      disabled={isDisabled}
    >
      <div className="flex items-center justify-center whitespace-nowrap">
        {isLoading ? (
          <Spinner className="h-5 w-5" />
        ) : (
          <>
            {shouldRenderIcon && (
              <div className="mr-2 flex h-5 w-5 shrink-0 items-center justify-center">
                {iconSvg}
              </div>
            )}
            <span
              className={cn(
                styleText.headline,
                coinbaseBranded ? 'text-white' : color.inverse,
              )}
            >
              {buttonText}
            </span>
          </>
        )}
      </div>
    </button>
  );
}
