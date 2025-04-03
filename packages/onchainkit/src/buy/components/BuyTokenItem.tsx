'use client';
import { useCallback, useMemo } from 'react';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import { cn, color, pressable, text } from '../../styles/theme';
import type { SwapUnit } from '../../swap/types';
import { TokenImage } from '../../token';
import { useBuyContext } from './BuyProvider';

export function BuyTokenItem({ swapUnit }: { swapUnit?: SwapUnit }) {
  const { handleSubmit, setIsDropdownOpen } = useBuyContext();

  if (!swapUnit || !swapUnit.token) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleClick = useCallback(() => {
    setIsDropdownOpen(false);
    handleSubmit(swapUnit);
  }, [handleSubmit, swapUnit, setIsDropdownOpen]);

  const hasInsufficientBalance =
    !swapUnit.balance ||
    Number.parseFloat(swapUnit.balance) < Number.parseFloat(swapUnit.amount);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const roundedAmount = useMemo(() => {
    if (!swapUnit.amount) {
      return '';
    }
    return getRoundedAmount(swapUnit.amount, 10);
  }, [swapUnit.amount]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const roundedBalance = useMemo(() => {
    return getRoundedAmount(swapUnit.balance || '0', 3);
  }, [swapUnit.balance]);

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
          hasInsufficientBalance ? color.foregroundMuted : color.foreground,
        )}
      >
        <div>
          {roundedAmount} {swapUnit.token.name}
        </div>
        <div
          className={cn(
            'text-xs',
            hasInsufficientBalance ? color.error : color.foregroundMuted,
          )}
        >{`${
          hasInsufficientBalance ? 'Insufficient balance' : 'Balance'
        }: ${roundedBalance}`}</div>
      </div>
    </button>
  );
}
