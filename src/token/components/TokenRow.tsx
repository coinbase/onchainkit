import { memo } from 'react';
import type { TokenRowReact } from '../types';
import { formatAmount } from '../core/formatAmount';
import { TokenImage } from './TokenImage';

export const TokenRow = memo(function TokenRow({
  token,
  amount,
  onClick,
  hideImage,
  hideSymbol,
}: TokenRowReact) {
  return (
    <button
      data-testid="ockTokenRow_Container"
      className="flex h-16 w-full cursor-pointer items-center justify-between bg-white px-2 py-1 hover:bg-[#cacbce] active:bg-[#bfc1c3]"
      onClick={() => onClick?.(token)}
    >
      <span className="flex items-center gap-3">
        {!hideImage && <TokenImage token={token} size={48} />}
        <span className="flex flex-col items-start">
          <span className="font-medium leading-normal text-[#0A0B0D]">{token.name}</span>
          {!hideSymbol && (
            <span className="font-normal leading-normal text-[#5B616E]">{token.symbol}</span>
          )}
        </span>
      </span>
      <span data-testid="ockTokenRow_Amount" className="font-normal leading-normal text-[#5B616E]">
        {formatAmount(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: Number(amount) < 1 ? 5 : 2,
        })}
      </span>
    </button>
  );
});
