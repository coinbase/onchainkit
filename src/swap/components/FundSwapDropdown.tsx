import { useCallback, useMemo } from 'react';
import { background, cn, color, text } from '../../styles/theme';
import type { SwapUnit } from '../types';
import { useFundSwapContext } from './FundSwapProvider';
import { getRoundedAmount } from '../../core/utils/getRoundedAmount';
import { ONRAMP_PAYMENT_METHODS } from '../constants';
import { useAccount } from 'wagmi';
import { ONRAMP_BUY_URL } from '../../fund/constants';
import { getFundingPopupSize } from '../../fund/utils/getFundingPopupSize';
import { openPopup } from '../../internal/utils/openPopup';
import { FundSwapOnrampItem } from './FundSwapOnrampItem';
import { FundSwapTokenItem } from './FundSwapTokenItem';

export function FundSwapDropdown() {
  const { to, fromETH, fromUSDC } = useFundSwapContext();
  const { address } = useAccount();

  const handleOnrampClick = useCallback(
    (paymentMethodId: string) => {
      return () => {
        const appId = '817a37b6-9371-41f6-a362-6fb57cf3c4ff';
        const assetSymbol = to?.token?.symbol;
        const fundAmount = to?.amountUSD;
        const fundingUrl = `${ONRAMP_BUY_URL}/one-click?appId=${appId}&addresses={"${address}":["base"]}&assets=["${assetSymbol}"]&presetFiatAmount=${fundAmount}&defaultPaymentMethod=${paymentMethodId}`;
        console.log({ fundingUrl });
        console.log(paymentMethodId);
        const { height, width } = getFundingPopupSize('md', fundingUrl);
        openPopup({
          url: fundingUrl,
          height,
          width,
          target: '_blank',
        });
      };
    },
    [to]
  );

  const formattedAmountUSD = useMemo(() => {
    if (!to?.amountUSD || to?.amountUSD === '0') {
      return null;
    }
    const roundedAmount = Number(getRoundedAmount(to?.amountUSD, 2));
    return `$${roundedAmount.toFixed(2)}`;
  }, [to?.amountUSD]);

  return (
    <div
      className={cn(
        color.foreground,
        background.alternate,
        'absolute right-0 bottom-0 flex translate-y-[105%] flex-col gap-2',
        'rounded p-2'
      )}
    >
      <div className="px-2 pt-2">Buy with</div>
      <FundSwapTokenItem swapUnit={fromETH} />
      <FundSwapTokenItem swapUnit={fromUSDC} />

      {ONRAMP_PAYMENT_METHODS.map((method) => {
        return (
          <FundSwapOnrampItem
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
