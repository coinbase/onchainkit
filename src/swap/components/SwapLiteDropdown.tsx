import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { getRoundedAmount } from '../../core/utils/getRoundedAmount';
import { ONRAMP_BUY_URL } from '../../fund/constants';
import { getFundingPopupSize } from '../../fund/utils/getFundingPopupSize';
import { openPopup } from '../../internal/utils/openPopup';
import { background, cn, color, text } from '../../styles/theme';
import { ONRAMP_PAYMENT_METHODS } from '../constants';
import { SwapLiteOnrampItem } from './SwapLiteOnrampItem';
import { useSwapLiteContext } from './SwapLiteProvider';
import { SwapLiteTokenItem } from './SwapLiteTokenItem';

export function SwapLiteDropdown() {
  const { to, fromETH, fromUSDC, from, projectId, startPopupMonitor } =
    useSwapLiteContext();
  const { address } = useAccount();

  const handleOnrampClick = useCallback(
    (paymentMethodId: string) => {
      return () => {
        const assetSymbol = to?.token?.symbol;
        const fundAmount = to?.amount;
        const fundingUrl = `${ONRAMP_BUY_URL}/one-click?appId=${projectId}&addresses={"${address}":["base"]}&assets=["${assetSymbol}"]&presetCryptoAmount=${fundAmount}&defaultPaymentMethod=${paymentMethodId}`;
        const { height, width } = getFundingPopupSize('md', fundingUrl);
        const popupWindow = openPopup({
          url: fundingUrl,
          height,
          width,
          target: '_blank',
        });

        if (popupWindow) {
          // Detects when the popup is closed
          // to stop loading state
          startPopupMonitor(popupWindow);
        }
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
  const showFromToken =
    to?.token?.symbol !== from?.token?.symbol &&
    from &&
    from?.token?.symbol !== 'ETH' &&
    from?.token?.symbol !== 'USDC';

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
      {showFromToken && <SwapLiteTokenItem swapUnit={from} />}

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
