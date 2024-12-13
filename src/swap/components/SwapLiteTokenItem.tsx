import { useCallback, useMemo } from 'react';
import { getRoundedAmount } from '../../core/utils/getRoundedAmount';
import { cn, color } from '../../styles/theme';
import { TokenImage } from '../../token';
import type { SwapUnit } from '../types';
import { useSwapLiteContext } from './SwapLiteProvider';

export function SwapLiteTokenItem({ swapUnit }: { swapUnit: SwapUnit }) {
  const { handleSubmit, setIsDropdownOpen } = useSwapLiteContext();

  if (!swapUnit?.token) {
    return null;
  }

  const handleClick = useCallback(() => {
    setIsDropdownOpen(false);
    handleSubmit(swapUnit);
  }, [handleSubmit, swapUnit, setIsDropdownOpen]);

  const hasInsufficientBalance =
    !swapUnit.balance ||
    Number.parseFloat(swapUnit.balance) < Number.parseFloat(swapUnit.amount);

  const roundedAmount = useMemo(() => {
    return getRoundedAmount(swapUnit.amount, 10);
  }, [swapUnit.amount]);

  const roundedBalance = useMemo(() => {
    return getRoundedAmount(swapUnit.balance || '0', 10);
  }, [swapUnit.balance]);

  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        !hasInsufficientBalance && 'hover:bg-[var(--ock-bg-inverse)]',
      )}
      onClick={handleClick}
      type="button"
      disabled={hasInsufficientBalance}
    >
      <TokenImage token={swapUnit.token} size={36} />
      <div
        className={cn(
          'flex flex-col items-start',
          hasInsufficientBalance && color.foregroundMuted,
        )}
      >
        <div>
          {roundedAmount} {swapUnit.token.name}
        </div>
        <div
          className={cn('text-xs', color.foregroundMuted)}
        >{`Balance: ${roundedBalance}`}</div>
      </div>
    </button>
  );
}
