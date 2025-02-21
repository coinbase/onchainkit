import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { MintEvent } from '@/core/analytics/types';
import { QuantitySelector } from '@/internal/components/QuantitySelector';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { cn } from '@/styles/theme';

type NFTQuantitySelectorReact = {
  className?: string;
};

export function NFTQuantitySelector({ className }: NFTQuantitySelectorReact) {
  const { maxMintsPerWallet, setQuantity } = useNFTContext();
  const { sendAnalytics } = useAnalytics();

  // if max is 1, no need to show quantity selector
  if (maxMintsPerWallet === 1) {
    return null;
  }

  const handleQuantityChange = (newValue: string) => {
    const newQuantity = Number.parseInt(newValue, 10);

    if (!Number.isNaN(newQuantity)) {
      sendAnalytics(MintEvent.MintQuantityChanged, {
        quantity: newQuantity,
      });
    }
    setQuantity(newValue);
  };

  return (
    <div className={cn('py-1', className)}>
      <QuantitySelector
        className={className}
        onChange={handleQuantityChange}
        minQuantity={1}
        maxQuantity={maxMintsPerWallet}
        placeholder=""
      />
    </div>
  );
}
