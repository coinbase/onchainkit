import { QuantitySelector } from '@/internal/components/QuantitySelector';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { useMintAnalytics } from '@/nft/hooks/useMintAnalytics';
import { cn } from '@/styles/theme';

type NFTQuantitySelectorReact = {
  className?: string;
};

export function NFTQuantitySelector({ className }: NFTQuantitySelectorReact) {
  const { maxMintsPerWallet, setQuantity } = useNFTContext();
  const { handleQuantityChange } = useMintAnalytics();

  // if max is 1, no need to show quantity selector
  if (maxMintsPerWallet === 1) {
    return null;
  }

  const handleQuantityUpdate = (value: string) => {
    setQuantity(value);
    const quantity = Number.parseInt(value, 10);
    if (!Number.isNaN(quantity)) {
      handleQuantityChange(quantity);
    }
  };

  return (
    <div className={cn('py-1', className)}>
      <QuantitySelector
        className={className}
        onChange={handleQuantityUpdate}
        minQuantity={1}
        maxQuantity={maxMintsPerWallet}
        placeholder=""
      />
    </div>
  );
}
