import { getOnrampBuyUrl } from '@/fund/utils/getOnrampBuyUrl';
import { SwapUnit } from '@/swap/types';

type GetBuyFundingUrlParams = {
  to?: SwapUnit;
  sessionToken?: string;
  paymentMethodId?: string;
};

export function getBuyFundingUrl({
  to,
  sessionToken,
  paymentMethodId,
}: GetBuyFundingUrlParams) {
  const fundAmount = to?.amount;

  if (!sessionToken) {
    return undefined;
  }

  return getOnrampBuyUrl({
    sessionToken,
    presetCryptoAmount: Number(fundAmount),
    defaultPaymentMethod: paymentMethodId,
    originComponentName: 'FundCard',
  });
}
