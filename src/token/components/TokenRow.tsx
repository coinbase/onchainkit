import { memo } from 'react';
import { formatAmount } from '../core/formatAmount';
import type { TokenRowReact } from '../types';
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
      type="button"
      data-testid="ockTokenRow_Container"
      className="ock-tokenrow-button"
      onClick={() => onClick?.(token)}
    >
      <span className="ock-tokenrow-left">
        {!hideImage && <TokenImage token={token} size={48} />}
        <span className="ock-tokenrow-body">
          <span className="ock-tokenrow-name">{token.name}</span>
          {!hideSymbol && <span className="ock-tokenrow-symbol">{token.symbol}</span>}
        </span>
      </span>
      <span data-testid="ockTokenRow_Amount" className="ock-tokenrow-data">
        {formatAmount(amount, {
          minimumFractionDigits: 2,
          maximumFractionDigits: Number(amount) < 1 ? 5 : 2,
        })}
      </span>
    </button>
  );
});
