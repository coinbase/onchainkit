import {
  CDP_CREATE_PRODUCT_CHARGE,
  CDP_HYDRATE_CHARGE,
} from '../network/definitions/pay';
import { type JSONRPCResult, sendRequest } from '../network/request';
import type {
  BuildPayTransactionParams,
  BuildPayTransactionResponse,
  CreateProductChargeParams,
  HydrateChargeAPIParams,
} from './types';
import { getPayErrorMessage } from './utils/getPayErrorMessage';

export async function buildPayTransaction({
  address,
  chargeId,
  productId,
}: BuildPayTransactionParams): Promise<BuildPayTransactionResponse> {
  try {
    let res: JSONRPCResult<BuildPayTransactionResponse>;
    if (chargeId) {
      res = await sendRequest<
        HydrateChargeAPIParams,
        BuildPayTransactionResponse
      >(CDP_HYDRATE_CHARGE, [
        {
          sender: address,
          chargeId,
        },
      ]);
    } else if (productId) {
      res = await sendRequest<
        CreateProductChargeParams,
        BuildPayTransactionResponse
      >(CDP_CREATE_PRODUCT_CHARGE, [
        {
          sender: address,
          productId,
        },
      ]);
    } else {
      return {
        code: 'AmBPTa01', // Api Module Build Pay Transaction Error 01
        error: 'No chargeId or productId provided',
        message: getPayErrorMessage(),
      };
    }
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
