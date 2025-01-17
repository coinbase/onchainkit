import { useCallback, useEffect } from 'react';
import type { PaymentMethod } from '../types';
import { buildPaymentMethods } from '../utils/buildPaymentMethods';
import { fetchOnrampOptions } from '../utils/fetchOnrampOptions';

export const usePaymentMethods = ({
  country,
  subdivision,
  currency,
  setPaymentMethods,
  setPaymentMethodsLoading,
}: {
  country: string;
  subdivision?: string;
  currency: string;
  setPaymentMethods: (paymentMethods: PaymentMethod[]) => void;
  setPaymentMethodsLoading: (loading: boolean) => void;
}) => {
  const handleFetchPaymentMethods = useCallback(async () => {
    setPaymentMethodsLoading(true);

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
      setPaymentMethodsLoading(false);
    }
  }, [
    country,
    subdivision,
    currency,
    setPaymentMethods,
    setPaymentMethodsLoading,
  ]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: initial effect
  useEffect(() => {
    handleFetchPaymentMethods();
  }, []);
};
