import { truncateDecimalPlaces } from '@/internal/utils/truncateDecimalPlaces';
import { useCallback, useMemo } from 'react';

type UseAmountInputParams = {
  setFiatAmount: (value: string) => void;
  setCryptoAmount: (value: string) => void;
  selectedInputType: 'fiat' | 'crypto';
  exchangeRate: string;
};

export const useAmountInput = ({
  setFiatAmount,
  setCryptoAmount,
  selectedInputType,
  exchangeRate,
}: UseAmountInputParams) => {
  const handleFiatChange = useCallback(
    (value: string) => {
      const fiatValue = truncateDecimalPlaces(value, 2);
      setFiatAmount(fiatValue);

      const calculatedCryptoValue = String(
        Number(fiatValue) * Number(exchangeRate),
      );
      const resultCryptoValue = truncateDecimalPlaces(calculatedCryptoValue, 8);
      setCryptoAmount(calculatedCryptoValue === '0' ? '' : resultCryptoValue);
    },
    [exchangeRate, setFiatAmount, setCryptoAmount],
  );

  const handleCryptoChange = useCallback(
    (value: string) => {
      const truncatedValue = truncateDecimalPlaces(value, 8);
      setCryptoAmount(truncatedValue);

      const calculatedFiatValue = String(
        Number(truncatedValue) / Number(exchangeRate),
      );

      const resultFiatValue = truncateDecimalPlaces(calculatedFiatValue, 2);
      setFiatAmount(resultFiatValue === '0' ? '' : resultFiatValue);
    },
    [exchangeRate, setFiatAmount, setCryptoAmount],
  );

  const handleChange = useCallback(
    (value: string, onChange?: (value: string) => void) => {
      if (selectedInputType === 'fiat') {
        handleFiatChange(value);
      } else {
        handleCryptoChange(value);
      }

      onChange?.(value);
    },
    [handleFiatChange, handleCryptoChange, selectedInputType],
  );

  return useMemo(
    () => ({
      handleChange,
      handleFiatChange,
      handleCryptoChange,
    }),
    [handleChange, handleFiatChange, handleCryptoChange],
  );
};
