import { TokenImage } from '../../token';
import { background, cn, color } from '../../styles/theme';
import { useFundSwapContext } from './FundSwapProvider';
import { SwapUnit } from '../types';
import { useCallback } from 'react';

function TokenItem({ swapUnit }: { swapUnit: SwapUnit }) {
  const { handleSubmit } = useFundSwapContext();

  if (!swapUnit?.token) {
    return null;
  }

  const handleClick = useCallback(() => {
    handleSubmit(swapUnit);
  }, [handleSubmit]);

  return (
    <div className="flex gap-2 items-center" onClick={handleClick}>
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
        'flex flex-col absolute translate-y-[110%] right-0  bottom-0 gap-4',
        'rounded p-4',
      )}
    >
      <div>Buy with</div>
      <TokenItem swapUnit={fromETH} />
      <TokenItem swapUnit={fromUSDC} />
    </div>
  );
}
