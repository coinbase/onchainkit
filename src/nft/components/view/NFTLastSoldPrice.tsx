import type { ReactNode } from 'react';
import { cn, color, text } from '../../../styles/theme';
import { formatAmount } from '../../../token/utils/formatAmount';
import { useNFTContext } from '../NFTProvider';

type NFTLastSoldPriceReact = {
  className?: string;
  label?: ReactNode;
};

export function NFTLastSoldPrice({
  className,
  label = 'Mint price',
}: NFTLastSoldPriceReact) {
  const {
    lastSoldPrice: { amount, currency, amountUSD },
  } = useNFTContext();

  if (!amount || !currency || !amountUSD) {
    return null;
  }

  return (
    <div className={cn('flex justify-between py-0.5', text.label2, className)}>
      <div className={cn(color.foregroundMuted)}>{label}</div>
      <div className="flex">
        <div className={text.label1}>
          {amount} {currency}
        </div>
        <div className="px-2">~</div>
        <div>
          $
          {formatAmount(`${amountUSD}`, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </div>
  );
}
