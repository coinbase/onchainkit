import { CDP_GET_SWAP_TRADE } from '../../network/definitions/swap';
import { sendRequest } from '../../network/request';
import { getAPIParamsForToken } from './getAPIParamsForToken';
import { getSwapTransaction } from './getSwapTransaction';
import { getSwapErrorCode } from './getSwapErrorCode';
import type {
  BuildSwapTransactionParams,
  BuildSwapTransactionResponse,
  SwapAPIResponse,
  SwapError,
  SwapAPIParams,
} from '../types';

/**
 * Retrieves an unsigned transaction for a swap from Token A to Token B.
 */
export async function buildSwapTransaction(
  params: BuildSwapTransactionParams,
): Promise<BuildSwapTransactionResponse> {
  // Default parameters
  const defaultParams = {
    amountReference: 'from',
    isAmountInDecimals: false,
  };

  const apiParams = getAPIParamsForToken({ ...defaultParams, ...params });

  try {
    const res = await sendRequest<SwapAPIParams, SwapAPIResponse>(
      CDP_GET_SWAP_TRADE,
      [apiParams],
    );
    if (res.error) {
      return {
        code: getSwapErrorCode('swap', res.error?.code),
        error: res.error.message,
      } as SwapError;
    }

    const trade = res.result;
    return {
      approveTransaction: trade.approveTx
        ? getSwapTransaction(trade.approveTx, trade.chainId)
        : undefined,
      fee: trade.fee,
      quote: trade.quote,
      transaction: getSwapTransaction(trade.tx, trade.chainId),
      warning: trade.quote.warning,
    };
  } catch (error) {
    return {
      code: getSwapErrorCode('uncaught-swap'),
      error: 'Something went wrong',
    };
  }
}
