import { useMemo } from 'react';
import { cn, text } from '../../styles/theme';
import { formatAmount } from '../../token/utils/formatAmount';
import { useNftMintContext } from './NftMintProvider';
import { useEthPrice } from '../../internal/hooks/useEthPrice';
import { useNftQuantityContext } from './NftQuantityProvider';

type NftTotalCostProps = {
  className?: string;
};

export function NftTotalCost({ className }: NftTotalCostProps) {
  const { price } = useNftMintContext();
  const { quantity } = useNftQuantityContext();
  const ethPrice = useEthPrice();

  const nativePrice = useMemo(() => {
    if (price?.amount?.decimal === undefined) {
      return 0;
    }

    // calculate multiplier to avoid floating point errors
    const nativeMultiplier = price.amount.decimal.toString().includes('.')
      ? 10 ** price.amount.decimal.toString().split('.')[1].length
      : 1;

    const multipliedNativePrice =
      BigInt(price.amount.decimal * nativeMultiplier) * BigInt(quantity);

    return Number(multipliedNativePrice) / nativeMultiplier;
  }, [price?.amount, quantity]);

  if (!price?.amount || !ethPrice.data) {
    return null;
  }

  if (price.amount.decimal === 0) {
    return (
      <div className={cn('flex py-2', text.body, className)}>
        Free
      </div>
    );
  }

  return (
    <div className={cn('flex py-2', text.body, className)}>
      <div className={text.headline}>
        {nativePrice} {price.currency?.symbol}
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
