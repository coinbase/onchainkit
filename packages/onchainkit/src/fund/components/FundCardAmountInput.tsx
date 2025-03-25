'use client';
import { AmountInput } from '@/internal/components/amount-input/AmountInput';
import { useThrottle } from '@/internal/hooks/useThrottle';
import { useCallback } from 'react';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { FundEvent } from '../../core/analytics/types';
import { useOnrampExchangeRate } from '../hooks/useOnrampExchangeRate';
import type { FundCardAmountInputPropsReact } from '../types';
import { useFundContext } from './FundCardProvider';

const THROTTLE_DELAY_MS = 5000;

export const FundCardAmountInput = ({
  className,
}: FundCardAmountInputPropsReact) => {
  const {
    fundAmountFiat,
    fundAmountCrypto,
    asset,
    selectedInputType,
    currency,
    exchangeRate,
    setFundAmountFiat,
    setFundAmountCrypto,
    country,
    subdivision,
    setExchangeRate,
    onError,
  } = useFundContext();

  const { fetchExchangeRate } = useOnrampExchangeRate({
    asset,
    currency,
    country,
    subdivision,
    setExchangeRate,
    onError,
  });

  const throttledFetchExchangeRate = useThrottle(
    fetchExchangeRate,
    THROTTLE_DELAY_MS,
  );

  const { sendAnalytics } = useAnalytics();

  /**
   * Handle amount changes with throttled updates
   *
   * Both setFiatAmount and setCryptoAmount on the AmountInput component are called with the new amount so we only need to fetch exchange rate when either is called.
   */
  const handleFiatAmountChange = useCallback(
    (amount: string) => {
      setFundAmountFiat(amount);
      throttledFetchExchangeRate();

      sendAnalytics(FundEvent.FundAmountChanged, {
        amount: Number(amount),
        currency,
      });
    },
    [currency, sendAnalytics, setFundAmountFiat, throttledFetchExchangeRate],
  );

  return (
    <AmountInput
      fiatAmount={fundAmountFiat}
      cryptoAmount={fundAmountCrypto}
      asset={asset}
      selectedInputType={selectedInputType}
      currency={currency}
      className={className}
      setFiatAmount={handleFiatAmountChange}
      setCryptoAmount={setFundAmountCrypto}
      exchangeRate={String(exchangeRate)}
    />
  );
};

export default FundCardAmountInput;
