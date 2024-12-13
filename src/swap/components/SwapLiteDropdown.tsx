import { useCallback, useMemo } from 'react';
import { background, cn, color, text } from '../../styles/theme';
import { useSwapLiteContext } from './SwapLiteProvider';
import { getRoundedAmount } from '../../core/utils/getRoundedAmount';
import { ONRAMP_PAYMENT_METHODS } from '../constants';
import { useAccount } from 'wagmi';
import { ONRAMP_BUY_URL } from '../../fund/constants';
import { getFundingPopupSize } from '../../fund/utils/getFundingPopupSize';
import { openPopup } from '../../internal/utils/openPopup';
import { SwapLiteOnrampItem } from './SwapLiteOnrampItem';
import { SwapLiteTokenItem } from './SwapLiteTokenItem';

export function SwapLiteDropdown() {
  const { to, fromETH, fromUSDC, from, projectId } = useSwapLiteContext();
  const { address } = useAccount();

  const handleOnrampClick = useCallback(
    (paymentMethodId: string) => {
      return () => {
        const assetSymbol = to?.token?.symbol;
        const fundAmount = to?.amount;
        const fundingUrl = `${ONRAMP_BUY_URL}/one-click?appId=${projectId}&addresses={"${address}":["base"]}&assets=["${assetSymbol}"]&presetCryptoAmount=${fundAmount}&defaultPaymentMethod=${paymentMethodId}`;
        const { height, width } = getFundingPopupSize('md', fundingUrl);
        openPopup({
          url: fundingUrl,
          height,
          width,
          target: '_blank',
        });
      };
    },
    [address, to, projectId],
  );

  const formattedAmountUSD = useMemo(() => {
    if (!to?.amountUSD || to?.amountUSD === '0') {
      return null;
    }
    const roundedAmount = Number(getRoundedAmount(to?.amountUSD, 2));
    return `$${roundedAmount.toFixed(2)}`;
  }, [to?.amountUSD]);

  const isToETH = to?.token?.symbol === 'ETH';
  const isToUSDC = to?.token?.symbol === 'USDC';
  const isToFrom = to?.token?.symbol === from?.token?.symbol;

  return (
    <div
      className={cn(
        color.foreground,
        background.alternate,
        'absolute right-0 bottom-0 flex translate-y-[105%] flex-col gap-2',
        'min-w-80 rounded p-2',
      )}
    >
      <div className="px-2 pt-2">Buy with</div>
      {!isToETH && <SwapLiteTokenItem swapUnit={fromETH} />}
      {!isToUSDC && <SwapLiteTokenItem swapUnit={fromUSDC} />}
      {from && !isToFrom && <SwapLiteTokenItem swapUnit={from} />}

      {ONRAMP_PAYMENT_METHODS.map((method) => {
        return (
          <SwapLiteOnrampItem
            key={method.id}
            name={method.name}
            description={method.description}
            onClick={handleOnrampClick(method.id)}
            icon={method.icon}
          />
        );
      })}

      {!!formattedAmountUSD && (
        <div
          className={cn('flex justify-end', text.legal, color.foregroundMuted)}
        >{`${to?.amount} ${to?.token?.name} ≈ ${formattedAmountUSD}`}</div>
      )}
    </div>
  );
}
