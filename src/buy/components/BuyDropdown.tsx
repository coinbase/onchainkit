import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { BuyEvent, type BuyOption } from '@/core/analytics/types';
import { openPopup } from '@/internal/utils/openPopup';
import { useOnchainKit } from '@/useOnchainKit';
import { useCallback, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { ONRAMP_BUY_URL } from '../../fund/constants';
import { getFundingPopupSize } from '../../fund/utils/getFundingPopupSize';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import { background, border, cn, color, text } from '../../styles/theme';
import { ONRAMP_PAYMENT_METHODS } from '../constants';
import { isApplePaySupported } from '../utils/isApplePaySupported';
import { BuyOnrampItem } from './BuyOnrampItem';
import { useBuyContext } from './BuyProvider';
import { BuyTokenItem } from './BuyTokenItem';

export function BuyDropdown() {
  const { projectId } = useOnchainKit();
  const { to, fromETH, fromUSDC, from, startPopupMonitor, setIsDropdownOpen } =
    useBuyContext();
  const { address } = useAccount();
  const { sendAnalytics } = useAnalytics();

  const handleOnrampClick = useCallback(
    (paymentMethodId: string) => {
      return () => {
        sendAnalytics(BuyEvent.BuyOptionSelected, {
          option: paymentMethodId as BuyOption,
        });

        const assetSymbol = to?.token?.symbol;
        let fundAmount = to?.amount;
        // funding url requires a leading zero if the amount is less than 1
        if (fundAmount?.[0] === '.') {
          fundAmount = `0${fundAmount}`;
        }
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
    [address, to, projectId, startPopupMonitor, sendAnalytics],
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsDropdownOpen]);

  const isApplePayEnabled = isApplePaySupported();

  return (
    <div
      className={cn(
        color.foreground,
        background.default,
        'absolute right-0 bottom-0 flex translate-y-[102%] flex-col gap-2',
        'z-10 min-w-80 rounded border p-2',
        border.radius,
      )}
    >
      <div className={cn(text.headline, 'px-2 pt-2')}>Buy with</div>
      {!isToETH && <BuyTokenItem swapUnit={fromETH} />}
      {!isToUSDC && <BuyTokenItem swapUnit={fromUSDC} />}
      {showFromToken && <BuyTokenItem swapUnit={from} />}

      {ONRAMP_PAYMENT_METHODS.map((method) => {
        if (method.id === 'APPLE_PAY' && !isApplePayEnabled) {
          return null;
        }
        return (
          <BuyOnrampItem
            key={method.id}
            name={method.name}
            description={method.description}
            onClick={handleOnrampClick(method.id)}
            icon={method.icon}
            amountUSDC={to?.amountUSD}
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
