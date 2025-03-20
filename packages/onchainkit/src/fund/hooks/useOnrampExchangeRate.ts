import { useCallback, useMemo } from 'react';
import type { OnrampError } from '../types';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';

export const useOnrampExchangeRate = ({
  asset,
  currency,
  country,
  subdivision,
  setExchangeRate,
  onError,
}: {
  asset: string;
  currency: string;
  country: string;
  subdivision?: string;
  setExchangeRate: (exchangeRate: number) => void;
  onError?: (error: OnrampError) => void;
}) => {
  const fetchExchangeRate = useCallback(async () => {
    try {
      const quote = await fetchOnrampQuote({
        purchaseCurrency: asset,
        paymentCurrency: currency,
        paymentAmount: '100',
        paymentMethod: 'CARD',
        country,
        subdivision,
      });

      setExchangeRate(
        Number(quote.purchaseAmount.value) /
          Number(quote.paymentSubtotal.value),
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error fetching exchange rate:', err);
        onError?.({
          errorType: 'handled_error',
          code: 'EXCHANGE_RATE_ERROR',
          debugMessage: err.message,
        });
      } else {
        console.error('Unknown error fetching exchange rate:', err);
        onError?.({
          errorType: 'unknown_error',
          code: 'EXCHANGE_RATE_ERROR',
          debugMessage: JSON.stringify(err),
        });
      }
    }
  }, [asset, country, subdivision, currency, onError, setExchangeRate]);

  return useMemo(() => ({ fetchExchangeRate }), [fetchExchangeRate]);
};
