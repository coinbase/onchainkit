import { buildPayTransaction } from '@/api';
import type { BuildPayTransactionParams } from '@/api';
import { REQUEST_CONTEXT } from '@/core/network/constants';
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
    REQUEST_CONTEXT.CHECKOUT,
  );

  if ('error' in response) {
    throw new Error(response.error);
  }

  return response;
};
