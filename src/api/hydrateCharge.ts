import { PAY_HYDRATE_CHARGE } from '../network/definitions/pay';
import { sendRequest } from '../network/request';
import { getPayErrorCode } from '../pay/utils/getPayErrorCode';
import type {
  HydrateChargeAPIParams,
  HydrateChargeParams,
  HydrateChargeResponse,
} from './types';

export async function hydrateCharge({
  sender,
  chargeId,
}: HydrateChargeParams): Promise<HydrateChargeResponse> {
  try {
    const res = await sendRequest<
      HydrateChargeAPIParams,
      HydrateChargeResponse
    >(PAY_HYDRATE_CHARGE, [
      {
        sender: sender,
        chainId: 8453,
        chargeId,
      },
    ]);
    if (res.error) {
      return {
        code: getPayErrorCode(res.error?.code),
        error: res.error.message,
        message: '',
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: getPayErrorCode(),
      error: 'Something went wrong',
      message: '',
    };
  }
}
