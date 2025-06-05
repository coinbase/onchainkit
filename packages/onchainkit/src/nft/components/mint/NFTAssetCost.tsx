import { multiplyFloats } from '@/internal/utils/multiplyFloats';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { cn, text } from '@/styles/theme';
import { formatAmount as formatSN } from '@/swap/utils/formatAmount';
import { formatAmount } from '@/token/utils/formatAmount';

type NFTAssetCostProps = {
  className?: string;
};

export function NFTAssetCost({ className }: NFTAssetCostProps) {
  const { price, quantity } = useNFTContext();

  if (
    price?.amount === undefined ||
    !price.currency ||
    price.amountUSD === undefined
  ) {
    return null;
  }

  if (Number(price?.amount) === 0) {
    return <div className={cn(text.body, 'flex py-1', className)}>Free</div>;
  }

  const totalAmount = multiplyFloats(Number(price.amount), quantity);
  const totalUSD = multiplyFloats(Number(price.amountUSD), quantity);
  const formattedCryptoAmount = formatSN(`${totalAmount}`);
  const formattedUSDAmount = formatAmount(`${totalUSD}`, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const ariaLabel = `Total cost: ${formattedCryptoAmount} ${price.currency}, approximately ${formattedUSDAmount} US dollars${quantity > 1 ? ` for ${quantity} items` : ''}`;

  return (
    <div
      className={cn(text.body, 'flex py-1', className)}
      aria-label={ariaLabel}
    >
      <div className={text.headline}>
        {formattedCryptoAmount} {price.currency}
      </div>
      <div className="px-2">~</div>
      <div>${formattedUSDAmount}</div>
    </div>
  );
}
