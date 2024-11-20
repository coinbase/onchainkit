import { useCallback, useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import {
  cn,
  text,
  color,
  background,
  border,
  pressable,
} from '../../styles/theme';
import { useFundSwapContext } from './FundSwapProvider';
import { checkmarkSvg } from '../../internal/svg/checkmarkSvg';

export function FundSwapButton() {
  const {
    setIsDropdownOpen,
    fromETH,
    fromUSDC,
    to,
    lifecycleStatus: { statusName },
  } = useFundSwapContext();
  const isLoading =
    to?.loading ||
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
        'px-4 py-3 h-12 w-24 items-center justify-center',
        isDisabled && pressable.disabled,
        text.headline,
      )}
      onClick={handleSubmit}
      data-testid="ockFundSwapButton_Button"
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
