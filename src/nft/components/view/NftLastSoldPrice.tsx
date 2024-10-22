import { cn, text } from '../../../styles/theme';
import { formatAmount } from '../../../token/utils/formatAmount';
import { useNftContext } from '../NftProvider';

type NftLastSoldPriceProps = {
  className?: string;
  label?: string;
};

export function NftLastSoldPrice({
  className,
  label = 'Mint price',
}: NftLastSoldPriceProps) {
  const {
    lastSoldPrice: { amount, currency, amountUSD },
  } = useNftContext();

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
