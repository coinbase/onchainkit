import { AmountInput } from '@/internal/components/amount-input/AmountInput';
import { useCallback, useEffect, useRef } from 'react';
import { useOnrampExchangeRate } from '../hooks/useOnrampExhangeRate';
import type { FundCardAmountInputPropsReact } from '../types';
import { useFundContext } from './FundCardProvider';

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

  // Ref to track if we're in cooldown
  const isInCooldown = useRef(false);
  const cooldownTimeout = useRef<NodeJS.Timeout>();

  // Exchange rate update with cooldown
  const updateExchangeRate = useCallback(() => {
    if (!isInCooldown.current) {
      fetchExchangeRate();
      isInCooldown.current = true;

      cooldownTimeout.current = setTimeout(() => {
        isInCooldown.current = false;
      }, 5000);
    }
  }, [fetchExchangeRate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimeout.current) {
        clearTimeout(cooldownTimeout.current);
      }
    };
  }, []);

  // Handle amount changes with updates
  const handleFiatAmountChange = useCallback(
    (amount: string) => {
      setFundAmountFiat(amount);
      updateExchangeRate();
    },
    [setFundAmountFiat, updateExchangeRate],
  );

  const handleCryptoAmountChange = useCallback(
    (amount: string) => {
      setFundAmountCrypto(amount);
      updateExchangeRate();
    },
    [setFundAmountCrypto, updateExchangeRate],
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
      setCryptoAmount={handleCryptoAmountChange}
      exchangeRate={String(exchangeRate)}
    />
  );
};

export default FundCardAmountInput;
