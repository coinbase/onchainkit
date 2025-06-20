import { RequestContext } from '@/core/network/constants';
import { SwapMessage } from '@/swap/constants';
import { UNSUPPORTED_AMOUNT_REFERENCE_ERROR_CODE } from '@/swap/constants';
import { CDP_GET_SWAP_TRADE } from '../core/network/definitions/swap';
import { sendBatchRequest } from '../core/network/request';
import { getSwapErrorCode } from '../swap/utils/getSwapErrorCode';
import type {
  BatchRequest,
  BatchResponse,
  BuildSwapTransactionParams,
  BuildSwapTransactionResponse,
  SwapAPIParams,
} from './types';
import { getAPIParamsForToken } from './utils/getAPIParamsForToken';
import { getSwapTransaction } from './utils/getSwapTransaction';

/**
 * Retrieves unsigned transactions for multiple swaps in a single batch request.
 * @param params Array of swap parameters for each transaction
 * @param context Request context
 * @returns Array of swap transaction responses
 */
export async function buildBatchSwapTransactions(
  params: BuildSwapTransactionParams[],
  _context: RequestContext = RequestContext.API,
): Promise<BuildSwapTransactionResponse[]> {
  // Default parameters
  const defaultParams = {
    amountReference: 'from' as const,
    isAmountInDecimals: false,
  };

  // Process each parameter set
  const apiParamsArray = params.map((param) => {
    // Check for unsupported amount reference
    if (param.useAggregator && param.amountReference === 'to') {
      return {
        code: UNSUPPORTED_AMOUNT_REFERENCE_ERROR_CODE,
        error: SwapMessage.UNSUPPORTED_AMOUNT_REFERENCE,
        message: '',
      };
    }

    let apiParams = getAPIParamsForToken({
      ...defaultParams,
      ...param,
    });

    if ('error' in apiParams) {
      return apiParams;
    }

    if (!param.useAggregator) {
      apiParams = {
        v2Enabled: true,
        ...apiParams,
      };
    }

    if (param.maxSlippage) {
      let slippagePercentage = param.maxSlippage;
      // Adjust slippage for V1 API (aggregator)
      if (param.useAggregator) {
        slippagePercentage = (Number(param.maxSlippage) * 10).toString();
      }
      apiParams = {
        slippagePercentage,
        ...apiParams,
      };
    }

    return apiParams;
  });

  // Check if any parameters had errors
  const errors = apiParamsArray.filter((params) => 'error' in params);
  if (errors.length > 0) {
    // Return error responses for all parameters
    return params.map((_, index) => {
      const error = errors[index];
      if (error && 'error' in error) {
        return error as BuildSwapTransactionResponse;
      }
      return {
        code: getSwapErrorCode('uncaught-swap'),
        error: 'Something went wrong',
        message: '',
      };
    });
  }

  try {
    // Create batch request
    const batchRequests: BatchRequest[] = apiParamsArray.map(
      (apiParams, index) => ({
        jsonrpc: '2.0',
        id: index + 1,
        method: CDP_GET_SWAP_TRADE,
        params: [apiParams as SwapAPIParams],
      }),
    );

    const responses = (await sendBatchRequest<BatchRequest>(
      batchRequests,
      _context,
    )) as unknown as BatchResponse[];

    // Process responses
    return responses.map((res: BatchResponse) => {
      if (res.error) {
        return {
          code: getSwapErrorCode('swap', res.error.code),
          error: res.error.message,
          message: '',
        };
      }

      if (!res.result) {
        return {
          code: getSwapErrorCode('uncaught-swap'),
          error: 'Invalid response format',
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
    });
  } catch {
    return params.map(() => ({
      code: getSwapErrorCode('uncaught-swap'),
      error: 'Something went wrong',
      message: '',
    }));
  }
}
