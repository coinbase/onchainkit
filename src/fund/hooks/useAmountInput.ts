import { useCallback, useMemo } from 'react';
import { useFundContext } from '../components/FundCardProvider';
import { truncateDecimalPlaces } from '../utils/truncateDecimalPlaces';

export const useAmountInput = () => {
  const {
    setFundAmountFiat,
    setFundAmountCrypto,
    selectedInputType,
    exchangeRate,
  } = useFundContext();

  const handleFiatChange = useCallback(
    (value: string) => {
      const fiatValue = truncateDecimalPlaces(value, 2);
      setFundAmountFiat(fiatValue);

      const calculatedCryptoValue = String(
        Number(fiatValue) * Number(exchangeRate),
      );
      const resultCryptoValue = truncateDecimalPlaces(calculatedCryptoValue, 8);
      setFundAmountCrypto(
        calculatedCryptoValue === '0' ? '' : resultCryptoValue,
      );
    },
    [exchangeRate, setFundAmountFiat, setFundAmountCrypto],
  );

  const handleCryptoChange = useCallback(
    (value: string) => {
      const truncatedValue = truncateDecimalPlaces(value, 8);
      setFundAmountCrypto(truncatedValue);

      const calculatedFiatValue = String(
        Number(truncatedValue) / Number(exchangeRate),
      );

      const resultFiatValue = truncateDecimalPlaces(calculatedFiatValue, 2);
      setFundAmountFiat(resultFiatValue === '0' ? '' : resultFiatValue);
    },
    [exchangeRate, setFundAmountFiat, setFundAmountCrypto],
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
