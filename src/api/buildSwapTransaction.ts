import { CDP_GET_SWAP_TRADE } from '../network/definitions/swap';
import { sendRequest } from '../network/request';
import type { BuildSwapTransactionResponse } from '../swap';
import type { SwapAPIResponse } from '../swap/types';
import { getSwapErrorCode } from '../swap/utils/getSwapErrorCode';
import type {
  APIError,
  BuildSwapTransactionParams,
  SwapAPIParams,
} from './types';
import { getAPIParamsForToken } from './utils/getAPIParamsForToken';
import { getSwapTransaction } from './utils/getSwapTransaction';

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

  const apiParamsOrError = getAPIParamsForToken({
    ...defaultParams,
    ...params,
  });
  if ((apiParamsOrError as APIError).error) {
    return apiParamsOrError as APIError;
  }
  const apiParams = apiParamsOrError as SwapAPIParams;

  if (!params.useAggregator) {
    apiParams.v2Enabled = true;
  }
  if (params.maxSlippage) {
    let slippage = params.maxSlippage;
    // Adjust slippage for V1 API (aggregator)
    // V1 expects slippage in tenths of a percent (e.g., 30 = 3%)
    if (params.useAggregator) {
      slippage = (Number(slippage) * 10).toString();
    }
    apiParams.slippagePercentage = slippage;
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
        message: '',
      };
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
      message: '',
    };
  }
}
