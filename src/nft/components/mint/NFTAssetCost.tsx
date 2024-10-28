import { multiplyFloats } from '../../../internal/utils/multiplyFloats';
import { cn, text } from '../../../styles/theme';
import { formatAmount } from '../../../token/utils/formatAmount';
import { useNFTContext } from '../NFTProvider';

type NFTAssetCostReact = {
  className?: string;
};

export function NFTAssetCost({ className }: NFTAssetCostReact) {
  const { price, quantity } = useNFTContext();

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
        {multiplyFloats(price.amount, quantity)} {price.currency}
      </div>
      <div className="px-2">~</div>
      <div>
        $
        {formatAmount(`${multiplyFloats(price.amountUSD, quantity)}`, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    </div>
  );
}
