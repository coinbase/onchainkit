'use client';
import { AmountInput } from '@/internal/components/amount-input/AmountInput';
import { useThrottle } from '@/internal/hooks/useThrottle';
import { useCallback } from 'react';
import { FundEvent } from '../../core/analytics/types';
import { useOnrampExchangeRate } from '../hooks/useOnrampExchangeRate';
import type { FundCardAmountInputProps } from '../types';
import { useFundContext } from './FundCardProvider';
import { sendOCKAnalyticsEvent } from '@/core/analytics/utils/sendAnalytics';

const THROTTLE_DELAY_MS = 5000;

export const FundCardAmountInput = ({
  className,
}: FundCardAmountInputProps) => {
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

  /**
   * Handle amount changes with throttled updates
   *
   * Both setFiatAmount and setCryptoAmount on the AmountInput component are called with the new amount so we only need to fetch exchange rate when either is called.
   */
  const handleFiatAmountChange = useCallback(
    (amount: string) => {
      setFundAmountFiat(amount);
      throttledFetchExchangeRate();

      sendOCKAnalyticsEvent(FundEvent.FundAmountChanged, {
        amount: Number(amount),
        currency,
      });
    },
    [currency, setFundAmountFiat, throttledFetchExchangeRate],
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
