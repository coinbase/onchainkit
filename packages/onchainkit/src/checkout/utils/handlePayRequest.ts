import { buildPayTransaction } from '@/api';
import type { BuildPayTransactionParams } from '@/api';
import { RequestContext } from '@/core/network/constants';
import type { HandlePayRequestParams } from '../types';

export const handlePayRequest = async ({
  address,
  chargeHandler,
  productId,
}: HandlePayRequestParams) => {
  const buildPayTransactionParams: BuildPayTransactionParams = {
    address,
  };

  if (chargeHandler) {
    buildPayTransactionParams.chargeId = await chargeHandler();
  } else if (productId) {
    buildPayTransactionParams.productId = productId;
  }

  const response = await buildPayTransaction(
    buildPayTransactionParams,
    RequestContext.Checkout,
  );

  if ('error' in response) {
    throw new Error(response.error);
  }

  return response;
};
