import { cn, text } from '../../../styles/theme';
import { formatAmount } from '../../../token/utils/formatAmount';
import { getPricePerQuantity } from '../../utils/getPricePerQuantity';
import { useNftMintContext } from '../NftMintProvider';

type NftCostProps = {
  className?: string;
};

export function NftAssetCost({ className }: NftCostProps) {
  const { price, quantity } = useNftMintContext();

  if (
    price?.amount === undefined ||
    !price.currency ||
    price.amountUSD === undefined
  ) {
    return null;
  }

  if (price?.amount === 0) {
    return <div className={cn('flex py-2', text.body, className)}>Free</div>;
  }

  return (
    <div className={cn('flex py-2', text.body, className)}>
      <div className={text.headline}>
        {getPricePerQuantity(`${price.amount}`, quantity)} {price.currency}
      </div>
      <div className="px-2">~</div>
      <div>
        $
        {formatAmount(getPricePerQuantity(`${price.amountUSD}`, quantity), {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}
