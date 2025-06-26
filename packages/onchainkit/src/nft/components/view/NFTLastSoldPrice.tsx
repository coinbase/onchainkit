import { useNFTContext } from '@/nft/components/NFTProvider';
import type { ReactNode } from 'react';
import { cn, text } from '../../../styles/theme';
import { formatToDecimalString } from '@/utils/formatter';
import { formatAmount } from '../../../token/utils/formatAmount';

type NFTLastSoldPriceProps = {
  className?: string;
  label?: ReactNode;
};

export function NFTLastSoldPrice({
  className,
  label = 'Last sale price',
}: NFTLastSoldPriceProps) {
  const { lastSoldPrice } = useNFTContext();

  if (
    !lastSoldPrice?.amount ||
    !lastSoldPrice?.currency ||
    !lastSoldPrice?.amountUSD
  ) {
    return null;
  }

  const { amount, currency, amountUSD } = lastSoldPrice;

  return (
    <div className={cn(text.label2, 'flex justify-between', className)}>
      <div className={cn('text-ock-foreground-muted')}>{label}</div>
      <div className="flex">
        <div className={text.label1}>
          {formatToDecimalString(amount)} {currency}
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
