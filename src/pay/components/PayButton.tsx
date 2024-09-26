import { useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { cn, color, pressable, text as styleText } from '../../styles/theme';
import { useIcon } from '../../useIcon';
import { usePayContext } from './PayProvider';

export function PayButton({
  className,
  coinbaseBranded,
  disabled,
  icon,
  text = 'Pay',
}: {
  className?: string;
  coinbaseBranded?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  text?: string;
}) {
  if (coinbaseBranded) {
    icon = 'coinbasePay';
    text = 'Pay with Crypto';
  }
  const { lifeCycleStatus, onSubmit } = usePayContext();
  const iconSvg = useIcon({ icon });

  const isLoading = lifeCycleStatus?.statusName === 'transactionPending';
  const isDisabled = disabled || isLoading;
  const buttonText = useMemo(() => {
    if (lifeCycleStatus?.statusName === 'success') {
      return 'View payment details';
    }
    if (
      lifeCycleStatus?.statusName === 'error' &&
      lifeCycleStatus?.statusData.error === 'User has insufficient balance'
    ) {
      return 'Add funds';
    }
    return text;
  }, [lifeCycleStatus?.statusName, lifeCycleStatus?.statusData, text]);
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
          <Spinner className="w-5 h-5" />
        ) : (
          <>
            {shouldRenderIcon && (
              <div className="w-5 h-5 mr-2 flex items-center justify-center shrink-0">
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
