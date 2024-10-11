import { QuantitySelector } from '../../../internal/components/QuantitySelector';
import { cn } from '../../../styles/theme';
import { useNftMintContext } from '../NftMintProvider';

type NftQuantitySelectorReact = {
  className?: string;
};

export function NftQuantitySelector({ className }: NftQuantitySelectorReact) {
  const { maxMintsPerWallet, setQuantity } = useNftMintContext();

  // if max is 1, no need to show quantity selector
  if (Number(maxMintsPerWallet) === 1) {
    return null;
  }

  return (
    <div className={cn('py-2', className)}>
      <QuantitySelector
        className={className}
        onChange={setQuantity}
        minQuantity={1}
        maxQuantity={maxMintsPerWallet ? Number(maxMintsPerWallet) : undefined}
        placeholder=""
      />
    </div>
  );
}
