import { useOnchainKit } from '@/useOnchainKit';
import { useMemo } from 'react';
import { useFundContext } from '../components/FundCardProvider';
import { getOnrampBuyUrl } from '../utils/getOnrampBuyUrl';
import { useWalletAddress } from './useWalletAddress';

export const useFundCardFundingUrl = () => {
  const { projectId } = useOnchainKit();
  const {
    selectedPaymentMethod,
    selectedInputType,
    fundAmountFiat,
    fundAmountCrypto,
    asset,
    currency,
    walletAddress,
    walletNetwork,
  } = useFundContext();

  const { address, network } = useWalletAddress({
    walletAddress,
    walletNetwork,
  });

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
      addresses: { [address]: [network] },
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
    currency,
    network,
  ]);
};
