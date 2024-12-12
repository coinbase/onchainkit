import { useCallback } from 'react';
import { cn, color } from '../../styles/theme';
import { TokenImage } from '../../token';
import type { SwapUnit } from '../types';
import { useFundSwapContext } from './FundSwapProvider';

export function FundSwapTokenItem({ swapUnit }: { swapUnit: SwapUnit }) {
  const { handleSubmit, setIsDropdownOpen } = useFundSwapContext();

  if (!swapUnit?.token) {
    return null;
  }

  const handleClick = useCallback(() => {
    setIsDropdownOpen(false);
    handleSubmit(swapUnit);
  }, [handleSubmit, swapUnit, setIsDropdownOpen]);

  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        'hover:bg-[var(--ock-bg-inverse)]'
      )}
      onClick={handleClick}
      type="button"
    >
      <TokenImage token={swapUnit.token} size={36} />
      <div className="flex flex-col items-start">
        <div>
          {swapUnit.amount} {swapUnit.token.name}
        </div>
        <div
          className={cn('text-xs', color.foregroundMuted)}
        >{`Balance: ${swapUnit.balance}`}</div>
      </div>
    </button>
  );
}