import { useOnchainKit } from '@/useOnchainKit';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useFundContext } from '../components/FundCardProvider';
import { getOnrampBuyUrl } from '../utils/getOnrampBuyUrl';

export const useFundCardFundingUrl = () => {
  const { projectId, chain: defaultChain } = useOnchainKit();
  const { address, chain: accountChain } = useAccount();
  const {
    selectedPaymentMethod,
    selectedInputType,
    fundAmountFiat,
    fundAmountCrypto,
    asset,
    currency,
  } = useFundContext();

  const chain = accountChain || defaultChain;

  return useMemo(() => {
    if (projectId === null || address === undefined) {
      return undefined;
    }

    const fundAmount =
      selectedInputType === 'fiat' ? fundAmountFiat : fundAmountCrypto;

    return getOnrampBuyUrl({
      projectId,
      assets: [asset],
      presetFiatAmount:
        selectedInputType === 'fiat' ? Number(fundAmount) : undefined,
      presetCryptoAmount:
        selectedInputType === 'crypto' ? Number(fundAmount) : undefined,
      defaultPaymentMethod: selectedPaymentMethod?.id,
      addresses: { [address]: [chain.name.toLowerCase()] },
      fiatCurrency: currency,
      originComponentName: 'FundCard',
    });
  }, [
    asset,
    fundAmountFiat,
    fundAmountCrypto,
    selectedPaymentMethod,
    selectedInputType,
    projectId,
    address,
    chain,
    currency,
  ]);
};
