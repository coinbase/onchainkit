import { useCallback, useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { checkmarkSvg } from '../../internal/svg/checkmarkSvg';
import { closeSvg } from '../../internal/svg/closeSvg';
import {
  background,
  border,
  cn,
  color,
  pressable,
  text,
} from '../../styles/theme';
import { ConnectWallet } from '../../wallet';
import { useBuyContext } from './BuyProvider';

export function BuyButton() {
  const {
    address,
    setIsDropdownOpen,
    isDropdownOpen,
    from,
    fromETH,
    fromUSDC,
    to,
    lifecycleStatus: { statusName },
  } = useBuyContext();
  const isLoading =
    to?.loading ||
    from?.loading ||
    fromETH?.loading ||
    fromUSDC?.loading ||
    statusName === 'transactionPending' ||
    statusName === 'transactionApproved';

  const isDisabled = !to?.amount || !to?.token || isLoading;

  const handleSubmit = useCallback(() => {
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
    } else {
      setIsDropdownOpen(true);
    }
  }, [setIsDropdownOpen, isDropdownOpen]);

  const buttonContent = useMemo(() => {
    if (statusName === 'success') {
      return checkmarkSvg;
    }
    if (isDropdownOpen) {
      return closeSvg;
    }
    return 'Buy';
  }, [statusName, isDropdownOpen]);

  if (!isDisabled && !address) {
    return <ConnectWallet text="Buy" className="h-12 w-24 min-w-24" />;
  }

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
      data-testid="ockBuyButton_Button"
      disabled={isDisabled}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <span className={cn(text.headline, color.inverse)}>
          {buttonContent}
        </span>
      )}
    </button>
  );
}
