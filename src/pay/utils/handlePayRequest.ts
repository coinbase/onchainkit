import type { Address } from 'viem';
import { buildPayTransaction } from '../../api';
import type { BuildPayTransactionParams } from '../../api';

export const handlePayRequest = async ({
  address,
  chargeHandler,
  productId,
}: {
  address: Address;
  chargeHandler?: () => Promise<string>;
  productId?: string;
}) => {
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
