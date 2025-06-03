'use client';
import { useCallback, useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { checkmarkSvg } from '../../internal/svg/checkmarkSvg';
import { CloseSvg } from '../../internal/svg/closeSvg';
import { cn, pressable, text } from '../../styles/theme';
import { ConnectWallet, Wallet } from '../../wallet';
import { useBuyContext } from './BuyProvider';
import { Connected } from '@/connected';

function BuyButtonContent() {
  const {
    address,
    disabled,
    setIsDropdownOpen,
    isDropdownOpen,
    from,
    fromETH,
    fromUSDC,
    to,
    lifecycleStatus: { statusName },
    updateLifecycleStatus,
  } = useBuyContext();

  const isLoading =
    to?.loading ||
    from?.loading ||
    fromETH?.loading ||
    fromUSDC?.loading ||
    statusName === 'transactionPending' ||
    statusName === 'transactionApproved';

  const isMissingRequiredField = !to?.amount || !to?.token;
  const isDisabled = isLoading || disabled;

  const handleSubmit = useCallback(() => {
    if (isMissingRequiredField) {
      updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          code: 'TmBPc05',
          error: 'Missing required fields',
          message: 'Complete the field to continue',
        },
      });
      return;
    }
    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      return;
    }
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  }, [
    isMissingRequiredField,
    setIsDropdownOpen,
    isDropdownOpen,
    updateLifecycleStatus,
  ]);

  const buttonContent = useMemo(() => {
    if (statusName === 'success') {
      return checkmarkSvg;
    }
    if (isDropdownOpen) {
      return <CloseSvg className="fill-ock-icon-color-inverse" />;
    }
    return 'Buy';
  }, [statusName, isDropdownOpen]);

  if (!isDisabled && !address) {
    return (
      <Wallet>
        <ConnectWallet disconnectedLabel="Buy" className="h-12 w-24 min-w-24" />
      </Wallet>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        'bg-ock-bg-primary',
        'rounded-ock-default',
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
        <span className={cn(text.headline, 'text-ock-text-inverse')}>
          {buttonContent}
        </span>
      )}
    </button>
  );
}
