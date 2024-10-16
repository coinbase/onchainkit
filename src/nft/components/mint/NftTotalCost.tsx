import { useCallback, useMemo, useState } from 'react';
import { background, border, cn, text } from '../../../styles/theme';
import { formatAmount } from '../../../token/utils/formatAmount';
import { useNftMintContext } from '../NftMintProvider';
import { useEthPrice } from '../../../internal/hooks/useEthPrice';
import { infoSvg } from '../../../internal/svg/infoSvg';

type NftTotalCostProps = {
  className?: string;
  label?: string;
};

export function NftTotalCost({ className, label = 'Total cost' }: NftTotalCostProps) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { price, mintFee, quantity } = useNftMintContext();
  const ethPrice = useEthPrice();

  const toggleOverlay = useCallback(() => {
    setIsOverlayVisible((prev) => !prev);
  }, [])

  const showOverlay = useCallback(() => {
    setIsOverlayVisible(true);
  }, []);

  const hideOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);

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

  // TODO: only show icon if overlay will show
  const overlay = useMemo(() => {
    if (price?.amount === undefined || mintFee?.amount === undefined || !ethPrice.data) {
      return null;
    }
  
    return (
      <div className={cn(              
        background.default,
        border.radius,
        border.defaultActive,
        'absolute z-10 w-full border'
      )}>
        <div className={cn('flex items-center justify-between px-4 py-2', text.label2)}>
          <div>NFT cost</div>
          <div>
            $
            {formatAmount(`${nativePrice * ethPrice?.data}`, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className={cn('flex items-center justify-between px-4 py-2', text.label2)}>
          <div>Mint fee</div>
          <div>
            $
            {formatAmount(`${mintFee?.amount * ethPrice.data}`, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
    )
  }, [nativePrice, ethPrice, mintFee, price]);

  if (price?.amount === undefined || !ethPrice.data) {
    return null;
  }

  if (price.amount === 0) {
    return <div className={cn('flex py-2', text.body, className)}>Free</div>;
  }

  return (
    <div className="relative">
      <div
        className={cn(
          'flex items-center justify-between pt-2 pb-1',
          text.label2,
          className,
        )}
      >
        <div>{label}</div>
        <div className='flex items-center gap-2'>
          <div>
            $
            {formatAmount(`${nativePrice * ethPrice.data}`, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <button type="button" className='h-2.5 w-2.5 cursor-pointer object-cover' onClick={toggleOverlay} onMouseEnter={showOverlay} onMouseLeave={hideOverlay}>
              {infoSvg}
          </button>
        </div>
      </div>
      {isOverlayVisible && overlay}
    </div>
  );
}
