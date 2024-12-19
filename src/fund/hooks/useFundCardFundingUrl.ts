import { useOnchainKit } from '@/core-react/useOnchainKit';
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
    selectedAsset,
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
      assets: [selectedAsset],
      presetFiatAmount:
        selectedInputType === 'fiat' ? Number(fundAmount) : undefined,
      presetCryptoAmount:
        selectedInputType === 'crypto' ? Number(fundAmount) : undefined,
      defaultPaymentMethod: selectedPaymentMethod?.id,
      addresses: { [address]: [chain.name.toLowerCase()] },
    });
  }, [
    selectedAsset,
    fundAmountFiat,
    fundAmountCrypto,
    selectedPaymentMethod,
    selectedInputType,
    projectId,
    address,
    chain,
  ]);
};
