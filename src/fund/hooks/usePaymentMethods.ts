import { useCallback, useEffect } from 'react';
import type { PaymentMethod } from '../types';
import { buildPaymentMethods } from '../utils/buildPaymentMethods';
import { fetchOnrampOptions } from '../utils/fetchOnrampOptions';

export const usePaymentMethods = ({
  country,
  subdivision,
  currency,
  setPaymentMethods,
  setIsPaymentMethodsLoading,
}: {
  country: string;
  subdivision?: string;
  currency: string;
  setPaymentMethods: (paymentMethods: PaymentMethod[]) => void;
  setIsPaymentMethodsLoading: (loading: boolean) => void;
}) => {
  const handleFetchPaymentMethods = useCallback(async () => {
    setIsPaymentMethodsLoading(true);

    try {
      const paymentOptions = await fetchOnrampOptions({
        country,
        subdivision,
      });

      const paymentMethods = buildPaymentMethods(
        paymentOptions,
        currency,
        country,
      );

      setPaymentMethods(paymentMethods);
    } catch (error) {
      console.error('Error fetching payment options:', error);
    } finally {
      setIsPaymentMethodsLoading(false);
    }
  }, [
    country,
    subdivision,
    currency,
    setPaymentMethods,
    setIsPaymentMethodsLoading,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial effect
  useEffect(() => {
    handleFetchPaymentMethods();
  }, []);
};
