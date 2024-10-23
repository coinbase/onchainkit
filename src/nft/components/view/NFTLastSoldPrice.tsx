import type { ReactNode } from 'react';
import { cn, text } from '../../../styles/theme';
import { formatAmount } from '../../../token/utils/formatAmount';
import { useNFTContext } from '../NFTProvider';

type NFTLastSoldPriceProps = {
  className?: string;
  label?: ReactNode;
};

export function NFTLastSoldPrice({
  className,
  label = 'Mint price',
}: NFTLastSoldPriceProps) {
  const {
    lastSoldPrice: { amount, currency, amountUSD },
  } = useNFTContext();

  if (!amount || !currency || !amountUSD) {
    return null;
  }

  return (
    <div className={cn('flex justify-between py-2', text.label2, className)}>
      <div>{label}</div>
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
