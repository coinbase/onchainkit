import { getOnrampBuyUrl } from '@/fund/utils/getOnrampBuyUrl';
import { SwapUnit } from '@/swap/types';
import { Chain } from 'viem';

type GetBuyFundingUrlParams = {
  to?: SwapUnit;
  projectId?: string | null;
  address?: string;
  paymentMethodId?: string;
  chain: Chain;
};

export function getBuyFundingUrl({
  to,
  projectId,
  paymentMethodId,
  address,
  chain,
}: GetBuyFundingUrlParams) {
  const assetSymbol = to?.token?.symbol;
  const fundAmount = to?.amount;

  if (!projectId || address === undefined || !assetSymbol) {
    return undefined;
  }

  return getOnrampBuyUrl({
    projectId,
    assets: [assetSymbol],
    presetCryptoAmount: Number(fundAmount),
    defaultPaymentMethod: paymentMethodId,
    addresses: { [address]: [chain.name.toLowerCase()] },
    originComponentName: 'FundCard',
  });
}
