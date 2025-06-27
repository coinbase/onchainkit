'use client';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { BuyEvent, type BuyOptionType } from '@/core/analytics/types';
import { type PaymentMethod } from '@/fund/types';
import { openPopup } from '@/internal/utils/openPopup';
import { useOnchainKit } from '@/onchainkit/hooks/useOnchainKit';
import { useCallback, useEffect, useMemo } from 'react';
import { base } from 'viem/chains';
import { useAccount } from 'wagmi';
import { getFundingPopupSize } from '../../fund/utils/getFundingPopupSize';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import { cn, text } from '../../styles/theme';
import { ONRAMP_PAYMENT_METHODS } from '../constants';
import { getBuyFundingUrl } from '../utils/getBuyFundingUrl';
import { isApplePaySupported } from '../utils/isApplePaySupported';
import { BuyOnrampItem } from './BuyOnrampItem';
import { useBuyContext } from './BuyProvider';
import { BuyTokenItem } from './BuyTokenItem';

// eslint-disable-next-line complexity
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
          option: paymentMethodId as BuyOptionType,
        });

        const fundingUrl = getBuyFundingUrl({
          to,
          projectId,
          paymentMethodId,
          address,
          chain: base,
        });

        if (!fundingUrl) {
          return;
        }

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

  const availablePaymentMethods = useMemo(() => {
    return ONRAMP_PAYMENT_METHODS.filter((method: PaymentMethod) => {
      if (method.id === 'APPLE_PAY') {
        return isApplePayEnabled;
      }
      return true;
    });
  }, [isApplePayEnabled]);

  return (
    <div
      className={cn(
        'text-ock-foreground',
        'bg-ock-background',
        'absolute right-0 bottom-0 flex translate-y-[102%] flex-col gap-2',
        'z-10 min-w-80 rounded border p-2',
        'rounded-ock-default',
      )}
      role="menu"
      aria-label="Buy options"
    >
      <div
        className={cn(text.headline, 'px-2 pt-2')}
        role="heading"
        aria-level={2}
      >
        Buy with
      </div>
      {!isToETH && <BuyTokenItem swapUnit={fromETH} />}
      {!isToUSDC && <BuyTokenItem swapUnit={fromUSDC} />}
      {showFromToken && <BuyTokenItem swapUnit={from} />}

      {availablePaymentMethods.map((method) => {
        return (
          <BuyOnrampItem
            key={method.id}
            name={method.name}
            description={method.description}
            onClick={handleOnrampClick(method.id)}
            icon={method.icon}
            to={to}
          />
        );
      })}

      {!!formattedAmountUSD && (
        <div
          className={cn(
            'flex justify-end',
            text.legal,
            'text-ock-foreground-muted',
          )}
        >{`${to?.amount} ${to?.token?.name} ≈ ${formattedAmountUSD}`}</div>
      )}
    </div>
  );
}
