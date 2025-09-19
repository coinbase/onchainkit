import { useMemo } from 'react';
import { useFundContext } from '../components/FundCardProvider';
import { getOnrampBuyUrl } from '../utils/getOnrampBuyUrl';

export const useFundCardFundingUrl = () => {
  const {
    selectedPaymentMethod,
    selectedInputType,
    fundAmountFiat,
    fundAmountCrypto,
    currency,
    sessionToken,
  } = useFundContext();
  return useMemo(() => {
    if (!sessionToken) {
      return undefined;
    }

    const fundAmount =
      selectedInputType === 'fiat' ? fundAmountFiat : fundAmountCrypto;

    return getOnrampBuyUrl({
      sessionToken,
      presetFiatAmount:
        selectedInputType === 'fiat' ? Number(fundAmount) : undefined,
      presetCryptoAmount:
        selectedInputType === 'crypto' ? Number(fundAmount) : undefined,
      defaultPaymentMethod: selectedPaymentMethod?.id,
      fiatCurrency: currency,
      originComponentName: 'FundCard',
    });
  }, [
    fundAmountFiat,
    fundAmountCrypto,
    selectedPaymentMethod,
    selectedInputType,
    sessionToken,
    currency,
  ]);
};
