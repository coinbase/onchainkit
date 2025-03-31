import { RequestContext } from '@/core/network/constants';
import { SwapMessage } from '@/swap/constants';
import { UNSUPPORTED_AMOUNT_REFERENCE_ERROR_CODE } from '@/swap/constants';
import { CDP_GET_SWAP_TRADE } from '../core/network/definitions/swap';
import { sendRequest } from '../core/network/request';
import type { SwapAPIResponse } from '../swap/types';
import { getSwapErrorCode } from '../swap/utils/getSwapErrorCode';
import type {
  BuildSwapTransactionParams,
  BuildSwapTransactionResponse,
  SwapAPIParams,
} from './types';
import { getAPIParamsForToken } from './utils/getAPIParamsForToken';
import { getSwapTransaction } from './utils/getSwapTransaction';

/**
 * Retrieves an unsigned transaction for a swap from Token A to Token B.
 */
export async function buildSwapTransaction(
  params: BuildSwapTransactionParams,
  _context: RequestContext = RequestContext.API,
): Promise<BuildSwapTransactionResponse> {
  // Default parameters
  const defaultParams = {
    amountReference: 'from' as const,
    isAmountInDecimals: false,
  };

  let apiParams = getAPIParamsForToken({
    ...defaultParams,
    ...params,
  });
  if ('error' in apiParams) {
    return apiParams;
  }

  if (params.useAggregator && params.amountReference === 'to') {
    console.error(SwapMessage.UNSUPPORTED_AMOUNT_REFERENCE);
    return {
      code: UNSUPPORTED_AMOUNT_REFERENCE_ERROR_CODE,
      error: SwapMessage.UNSUPPORTED_AMOUNT_REFERENCE,
      message: '',
    };
  }

  if (!params.useAggregator) {
    apiParams = {
      v2Enabled: true,
      ...apiParams,
    };
  }
  if (params.maxSlippage) {
    let slippagePercentage = params.maxSlippage;
    // Adjust slippage for V1 API (aggregator)
    // V1 expects slippage in tenths of a percent (e.g., 30 = 3%)
    if (params.useAggregator) {
      slippagePercentage = (Number(params.maxSlippage) * 10).toString();
    }
    apiParams = {
      slippagePercentage,
      ...apiParams,
    };
  }

  try {
    const res = await sendRequest<SwapAPIParams, SwapAPIResponse>(
      CDP_GET_SWAP_TRADE,
      [apiParams],
      _context,
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
  } catch {
    return {
      code: getSwapErrorCode('uncaught-swap'),
      error: 'Something went wrong',
      message: '',
    };
  }
}
