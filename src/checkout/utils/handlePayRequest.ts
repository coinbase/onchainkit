import { buildPayTransaction } from '../../packages/core/api';
import type { BuildPayTransactionParams } from '../../packages/core/api';
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

  const response = await buildPayTransaction(buildPayTransactionParams);

  if ('error' in response) {
    throw new Error(response.error);
  }

  return response;
};
