import { useEffect, useMemo } from 'react';
import { useDebounce } from '../../core-react/internal/hooks/useDebounce';
import { useFundContext } from '../components/FundCardProvider';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';

export const useExchangeRate = (assetSymbol: string) => {
  const { setExchangeRate, exchangeRateLoading, setExchangeRateLoading } =
    useFundContext();

  const fetchExchangeRate = useDebounce(async () => {
    if (exchangeRateLoading) {
      return;
    }

    setExchangeRateLoading(true);
    const quote = await fetchOnrampQuote({
      purchaseCurrency: assetSymbol,
      paymentCurrency: 'USD',
      paymentAmount: '100',
      paymentMethod: 'CARD',
      country: 'US',
    });

    setExchangeRateLoading(false);

    setExchangeRate(
      Number(quote.purchaseAmount.value) / Number(quote.paymentSubtotal.value),
    );
  }, 1000);

  // biome-ignore lint/correctness/useExhaustiveDependencies: One time effect
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  return useMemo(() => ({ fetchExchangeRate }), [fetchExchangeRate]);
};
