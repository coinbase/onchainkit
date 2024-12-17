import { useNFTContext } from '@/core-react/nft/providers/NFTProvider';
import { QuantitySelector } from '@/ui-react/internal/QuantitySelector';
import { cn } from '../../../../styles/theme';

type NFTQuantitySelectorReact = {
  className?: string;
};

export function NFTQuantitySelector({ className }: NFTQuantitySelectorReact) {
  const { maxMintsPerWallet, setQuantity } = useNFTContext();

  // if max is 1, no need to show quantity selector
  if (maxMintsPerWallet === 1) {
    return null;
  }

  return (
    <div className={cn('py-1', className)}>
      <QuantitySelector
        className={className}
        onChange={setQuantity}
        minQuantity={1}
        maxQuantity={maxMintsPerWallet}
        placeholder=""
      />
    </div>
  );
}
