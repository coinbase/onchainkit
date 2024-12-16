import { useEffect, useMemo } from 'react';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { useDebounce } from '../../core-react/internal/hooks/useDebounce';
import { useFundContext } from '../components/FundCardProvider';

export const useExchangeRate = (assetSymbol: string) => {
  const { setExchangeRate, exchangeRate, exchangeRateLoading, setExchangeRateLoading } = useFundContext();

  const fetchExchangeRate = useDebounce(async () => {
    if(exchangeRateLoading) {
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
    console.log('quote', quote);
    setExchangeRate(Number(quote.purchaseAmount.value) / Number(quote.paymentSubtotal.value));
  }, 1000);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchExchangeRate();
  }, []);

  return useMemo(() => ({ exchangeRate, fetchExchangeRate }), [exchangeRate, fetchExchangeRate]);
};
