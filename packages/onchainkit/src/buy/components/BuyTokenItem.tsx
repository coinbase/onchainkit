'use client';
import { useCallback, useMemo } from 'react';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import { cn, pressable, text } from '../../styles/theme';
import type { SwapUnit } from '../../swap/types';
import { TokenImage } from '../../token';
import { useBuyContext } from './BuyProvider';

export function BuyTokenItem({ swapUnit }: { swapUnit: SwapUnit }) {
  const { handleSubmit, setIsDropdownOpen } = useBuyContext();

  const handleClick = useCallback(() => {
    setIsDropdownOpen(false);
    handleSubmit(swapUnit);
  }, [handleSubmit, swapUnit, setIsDropdownOpen]);

  const hasInsufficientBalance =
    !swapUnit?.balance ||
    Number.parseFloat(swapUnit.balance) < Number.parseFloat(swapUnit.amount);

  const roundedAmount = useMemo(() => {
    if (!swapUnit?.amount) {
      return '';
    }
    return getRoundedAmount(swapUnit.amount, 10);
  }, [swapUnit?.amount]);

  const roundedBalance = useMemo(() => {
    return getRoundedAmount(swapUnit?.balance || '0', 3);
  }, [swapUnit?.balance]);

  if (!swapUnit.token) {
    return null;
  }

  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        !hasInsufficientBalance && pressable.default,
        text.label2,
      )}
      onClick={handleClick}
      type="button"
      disabled={hasInsufficientBalance}
    >
      <TokenImage token={swapUnit.token} size={36} />
      <div
        className={cn(
          'flex flex-col items-start',
          hasInsufficientBalance
            ? 'text-ock-text-foreground-muted'
            : 'text-ock-text-foreground',
        )}
      >
        <div>
          {roundedAmount} {swapUnit.token.name}
        </div>
        <div
          className={cn(
            'text-xs',
            hasInsufficientBalance
              ? 'text-ock-text-error'
              : 'text-ock-text-foreground-muted',
          )}
        >{`${
          hasInsufficientBalance ? 'Insufficient balance' : 'Balance'
        }: ${roundedBalance}`}</div>
      </div>
    </button>
  );
}
