import { useCallback, useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { checkmarkSvg } from '../../internal/svg/checkmarkSvg';
import {
  background,
  border,
  cn,
  color,
  pressable,
  text,
} from '../../styles/theme';
import { useSwapLiteContext } from './SwapLiteProvider';

export function SwapLiteButton() {
  const {
    setIsDropdownOpen,
    from,
    fromETH,
    fromUSDC,
    to,
    lifecycleStatus: { statusName },
  } = useSwapLiteContext();
  const isLoading =
    to?.loading ||
    from?.loading ||
    fromETH.loading ||
    fromUSDC.loading ||
    statusName === 'transactionPending' ||
    statusName === 'transactionApproved';

  const isDisabled =
    !fromETH.amount ||
    !fromUSDC.amount ||
    !fromETH.token ||
    !fromUSDC.token ||
    !to?.amount ||
    !to?.token ||
    isLoading;

  const handleSubmit = useCallback(() => {
    setIsDropdownOpen(true);
  }, [setIsDropdownOpen]);

  const buttonContent = useMemo(() => {
    if (statusName === 'success') {
      return checkmarkSvg;
    }
    return 'Buy';
  }, [statusName]);

  return (
    <button
      type="button"
      className={cn(
        background.primary,
        border.radius,
        'flex rounded-xl',
        'h-12 w-24 items-center justify-center px-4 py-3',
        isDisabled && pressable.disabled,
        text.headline,
      )}
      onClick={handleSubmit}
      data-testid="ockSwapLiteButton_Button"
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, color.foreground)}>
          {buttonContent}
        </span>
      )}
    </button>
  );
}
