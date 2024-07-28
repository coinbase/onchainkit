import { CDP_GET_SWAP_TRADE } from '../../network/definitions/swap';
import { sendRequest } from '../../network/request';
import type {
  BuildSwapTransactionParams,
  BuildSwapTransactionResponse,
  SwapAPIParams,
  SwapAPIResponse,
  SwapError,
} from '../types';
import { getAPIParamsForToken } from './getAPIParamsForToken';
import { getSwapErrorCode } from './getSwapErrorCode';
import { getSwapTransaction } from './getSwapTransaction';

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

  let apiParams: SwapAPIParams;
  try {
    apiParams = getAPIParamsForToken({ ...defaultParams, ...params });
  } catch (_error) {
    return {
      code: getSwapErrorCode('uncaught-swap'),
      error: 'Something went wrong',
    };
  }

  if (!params.useAggregator) {
    apiParams = {
      v2Enabled: true,
      ...apiParams,
    };
  }

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
  } catch (_error) {
    return {
      code: getSwapErrorCode('uncaught-swap'),
      error: 'Something went wrong',
    };
  }
}
