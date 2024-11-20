import { TokenImage } from '../../token';
import { background, cn, color } from '../../styles/theme';
import { useFundSwapContext } from './FundSwapProvider';
import type { SwapUnit } from '../types';
import { useCallback } from 'react';

function TokenItem({ swapUnit }: { swapUnit: SwapUnit }) {
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
        'hover:bg-[var(--ock-bg-inverse)]',
      )}
      onClick={handleClick}
      type="button"
    >
      <TokenImage token={swapUnit.token} size={36} />
      <div className="flex flex-col">
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

export function FundSwapDropdown() {
  const { fromETH, fromUSDC } = useFundSwapContext();

  return (
    <div
      className={cn(
        color.foreground,
        background.alternate,
        'absolute right-0 bottom-0 flex translate-y-[110%] flex-col gap-2',
        'rounded p-2',
      )}
    >
      <div className="px-2 pt-2">Buy with</div>
      <TokenItem swapUnit={fromETH} />
      <TokenItem swapUnit={fromUSDC} />
    </div>
  );
}
