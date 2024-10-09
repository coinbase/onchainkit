import { useMemo } from 'react';
import { cn, text } from '../../styles/theme';
import { formatAmount } from '../../token/utils/formatAmount';
import { useNftMintContext } from './NftMintProvider';
import { useEthPrice } from '../../internal/hooks/useEthPrice';

type NftTotalCostProps = {
  className?: string;
};

export function NftTotalCost({ className }: NftTotalCostProps) {
  const { price, quantity } = useNftMintContext();
  const ethPrice = useEthPrice();

  const nativePrice = useMemo(() => {
    if (price?.amount === undefined || price?.amount === 0) {
      return 0;
    }

    // calculate multiplier to avoid floating point errors
    const nativeMultiplier = price.amount.toString().includes('.')
      ? 10 ** price.amount.toString().split('.')[1].length
      : 1;

    const multipliedNativePrice =
      BigInt(price.amount * nativeMultiplier) * BigInt(quantity);

    return Number(multipliedNativePrice) / nativeMultiplier;
  }, [price?.amount, quantity]);

  if (price?.amount === undefined || !ethPrice.data) {
    return null;
  }

  if (price.amount === 0) {
    return <div className={cn('flex py-2', text.body, className)}>Free</div>;
  }

  return (
    <div className={cn('flex py-2', text.body, className)}>
      <div className={text.headline}>
        {nativePrice} {price.currency}
      </div>
      <div className="px-2">~</div>
      <div>
        $
        {formatAmount(`${nativePrice * ethPrice.data}`, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}
