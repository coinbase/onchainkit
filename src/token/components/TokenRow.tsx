import { memo } from 'react';
import type { TokenRowReact } from '../types';
import { formatAmount } from '../core/formatAmount';
import { TokenImage } from './TokenImage';
import { TextBody, TextHeadline } from '../../internal/text';

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
      type="button"
      className="flex h-16 w-full cursor-pointer items-center justify-between bg-white px-2 py-1 active:bg-[#bfc1c3] hover:bg-[#cacbce]"
      onClick={() => onClick?.(token)}
    >
      <span className="flex items-center gap-3">
        {!hideImage && <TokenImage token={token} size={48} />}
        <span className="flex flex-col items-start">
          <TextHeadline>{token.name}</TextHeadline>
          {!hideSymbol && (
            <TextBody variant="foreground-muted">{token.symbol}</TextBody>
          )}
        </span>
      </span>
      <span
        data-testid="ockTokenRow_Amount"
        className="font-normal text-[#5B616E] leading-normal"
      >
        {formatAmount(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: Number(amount) < 1 ? 5 : 2,
        })}
      </span>
    </button>
  );
});
