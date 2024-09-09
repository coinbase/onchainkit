import { CDP_HYDRATE_CHARGE } from '../network/definitions/pay';
import { sendRequest } from '../network/request';
import type {
  BuildPayTransactionParams,
  BuildPayTransactionResponse,
  HydrateChargeAPIParams,
} from './types';
import { getPayErrorMessage } from './utils/getPayErrorMessage';

export async function buildPayTransaction({
  address,
  chargeId,
}: BuildPayTransactionParams): Promise<BuildPayTransactionResponse> {
  try {
    const res = await sendRequest<
      HydrateChargeAPIParams,
      BuildPayTransactionResponse
    >(CDP_HYDRATE_CHARGE, [
      {
        sender: address,
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
