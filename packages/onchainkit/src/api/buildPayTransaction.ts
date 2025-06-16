import { RequestContext, RequestContextType } from '@/core/network/constants';
import {
  CDP_CREATE_PRODUCT_CHARGE,
  CDP_HYDRATE_CHARGE,
} from '../core/network/definitions/pay';
import { type JSONRPCResult, sendRequest } from '../core/network/request';
import type {
  BuildPayTransactionParams,
  BuildPayTransactionResponse,
  CreateProductChargeParams,
  HydrateChargeAPIParams,
} from './types';
import { getPayErrorMessage } from './utils/getPayErrorMessage';
import { ApiErrorCode } from './constants';
import { buildErrorStruct } from './utils/buildErrorStruct';

export async function buildPayTransaction(
  params: BuildPayTransactionParams,
  _context: RequestContextType = RequestContext.API,
): Promise<BuildPayTransactionResponse> {
  const { address, chargeId, productId } = params;

  try {
    let res: JSONRPCResult<BuildPayTransactionResponse>;
    if (chargeId) {
      res = await sendRequest<
        HydrateChargeAPIParams,
        BuildPayTransactionResponse
      >(
        CDP_HYDRATE_CHARGE,
        [
          {
            sender: address,
            chargeId,
          },
        ],
        _context,
      );
    } else if (productId) {
      res = await sendRequest<
        CreateProductChargeParams,
        BuildPayTransactionResponse
      >(
        CDP_CREATE_PRODUCT_CHARGE,
        [
          {
            sender: address,
            productId,
          },
        ],
        _context,
      );
    } else {
      return buildErrorStruct({
        code: ApiErrorCode.AmBPTa01,
        error: 'No chargeId or productId provided',
        message: getPayErrorMessage(),
      });
    }
    if (res.error) {
      return buildErrorStruct({
        code: ApiErrorCode.AmBPTa02,
        error: res.error.message,
        message: getPayErrorMessage(res.error?.code),
      });
    }
    return res.result;
  } catch {
    return buildErrorStruct({
      code: ApiErrorCode.AmBPTa03,
      error: 'Something went wrong',
      message: getPayErrorMessage(),
    });
  }
}
