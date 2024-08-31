import { base } from 'viem/chains';
import { PAY_HYDRATE_CHARGE } from '../network/definitions/pay';
import { sendRequest } from '../network/request';
import { PAY_UNSUPPORTED_CHAIN_ERROR_MESSAGE } from '../pay/constants';
import type {
  BuildPayTransactionParams,
  BuildPayTransactionResponse,
  HydrateChargeAPIParams,
} from './types';
import { getPayErrorMessage } from './utils/getPayErrorMessage';

export async function buildPayTransaction({
  address,
  chainId,
  chargeId,
}: BuildPayTransactionParams): Promise<BuildPayTransactionResponse> {
  if (chainId !== base.id) {
    return {
      code: 'AmBPTa01', // Api Module Build Pay Transaction Error 01
      error: 'Pay Transactions must be on Base',
      message: PAY_UNSUPPORTED_CHAIN_ERROR_MESSAGE,
    };
  }
  try {
    const res = await sendRequest<
      HydrateChargeAPIParams,
      BuildPayTransactionResponse
    >(PAY_HYDRATE_CHARGE, [
      {
        sender: address,
        chainId: chainId,
        chargeId,
      },
    ]);
    if (res.error) {
      return {
        code: 'AmBPTa02', // Api Module Build Pay Transaction Error 02
        error: res.error.message,
        message: getPayErrorMessage(res.error?.code),
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: 'AmBPTa03', // Api Module Build Pay Transaction Error 03
      error: 'Something went wrong',
      message: getPayErrorMessage(),
    };
  }
}
