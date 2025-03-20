import { infoSvg } from '@/internal/svg/infoSvg';
import { multiplyFloats } from '@/internal/utils/multiplyFloats';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { background, border, cn, text } from '@/styles/theme';
import { formatAmount } from '@/token/utils/formatAmount';
import { type ReactNode, useCallback, useMemo, useState } from 'react';

type NFTTotalCostReact = {
  className?: string;
  label?: ReactNode;
};

export function NFTTotalCost({
  className,
  label = 'Total cost',
}: NFTTotalCostReact) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { price, mintFee, quantity } = useNFTContext();

  const toggleOverlay = useCallback(() => {
    setIsOverlayVisible((prev) => !prev);
  }, []);

  const showOverlay = useCallback(() => {
    setIsOverlayVisible(true);
  }, []);

  const hideOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);

  const overlay = useMemo(() => {
    // only show overlay if mintFee
    if (
      price?.amount === undefined ||
      price?.amountUSD === undefined ||
      mintFee?.amount === undefined ||
      mintFee.amountUSD === undefined
    ) {
      return null;
    }

    return (
      <div
        className={cn(
          background.default,
          border.radius,
          border.defaultActive,
          'absolute z-10 w-full border',
        )}
      >
        <div
          className={cn(
            text.label2,
            'flex items-center justify-between px-4 py-2',
          )}
        >
          <div>NFT cost</div>
          <div>
            $
            {formatAmount(
              `${multiplyFloats(Number(price.amountUSD), quantity)}`,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </div>
        </div>
        <div
          className={cn(
            'flex items-center justify-between px-4 py-2',
            text.label2,
          )}
        >
          <div>Mint fee</div>
          <div>
            $
            {formatAmount(
              `${multiplyFloats(Number(mintFee.amountUSD), quantity)}`,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </div>
        </div>
      </div>
    );
  }, [mintFee, price, quantity]);

  if (
    !price?.amount ||
    !price?.currency ||
    !price?.amountUSD ||
    !mintFee?.amount ||
    !mintFee.amountUSD
  ) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className={cn(
          text.label2,
          'flex items-center justify-between',
          className,
        )}
      >
        <div>{label}</div>
        <div className="flex items-center gap-2">
          <div>
            $
            {formatAmount(
              `${multiplyFloats(Number(price.amountUSD), quantity)}`,
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              },
            )}
          </div>
          {overlay && (
            <button
              type="button"
              data-testid="ockNFTTotalCostInfo"
              className="h-2.5 w-2.5 cursor-pointer object-cover"
              onClick={toggleOverlay}
              onMouseEnter={showOverlay}
              onMouseLeave={hideOverlay}
            >
              {infoSvg}
            </button>
          )}
        </div>
      </div>
      {isOverlayVisible && overlay}
    </div>
  );
}
