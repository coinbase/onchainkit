import { TokenImage } from '../../token';
import { background, cn, color } from '../../styles/theme';
import { useFundSwapContext } from './FundSwapProvider';
import type { SwapUnit } from '../types';
import { useCallback } from 'react';

function TokenItem({ swapUnit }: { swapUnit: SwapUnit }) {
  const { handleSubmit } = useFundSwapContext();

  if (!swapUnit?.token) {
    return null;
  }

  const handleClick = useCallback(() => {
    handleSubmit(swapUnit);
  }, [handleSubmit, swapUnit]);

  return (
    <div className="flex items-center gap-2" onClick={handleClick}>
      <TokenImage token={swapUnit.token} size={36} />
      <div className="flex flex-col">
        <div>
          {swapUnit.amount} {swapUnit.token.name}
        </div>
        <div
          className={cn('text-xs', color.foregroundMuted)}
        >{`Balance: ${swapUnit.balance}`}</div>
      </div>
    </div>
  );
}

export function FundSwapDropdown() {
  const { fromETH, fromUSDC } = useFundSwapContext();

  return (
    <div
      className={cn(
        color.foreground,
        background.alternate,
        'absolute right-0 bottom-0 flex translate-y-[110%] flex-col gap-4',
        'rounded p-4',
      )}
    >
      <div>Buy with</div>
      <TokenItem swapUnit={fromETH} />
      <TokenItem swapUnit={fromUSDC} />
    </div>
  );
}
