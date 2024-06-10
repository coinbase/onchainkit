import { CDP_GETSWAPTRADE } from '../../definitions/swap';
import { sendRequest } from '../../queries/request';
import type { GetSwapParams, Trade, SwapError, SwapAPIParams, GetSwapResponse } from '../types';
import { getParamsForToken } from './getParamsForToken';
import { getTransaction } from './getTransaction';

/**
 * Retrieves an unsigned transaction for a swap from Token A to Token B.
 */
export async function getSwap(params: GetSwapParams): Promise<GetSwapResponse> {
  // Default parameters
  const defaultParams = {
    amountReference: 'from',
    isAmountInDecimals: false,
  };

  const apiParams = getParamsForToken({ ...defaultParams, ...params });

  try {
    const res = await sendRequest<SwapAPIParams, Trade>(CDP_GETSWAPTRADE, [apiParams]);
    if (res.error) {
      return {
        code: res.error.code,
        error: res.error.message,
      } as SwapError;
    }

    const trade = res.result;
    return {
      approveTransaction: trade.approveTx
        ? getTransaction(trade.approveTx, trade.chainId)
        : undefined,
      fee: trade.fee,
      quote: trade.quote,
      transaction: getTransaction(trade.tx, trade.chainId),
      warning: trade.quote.warning,
    };
  } catch (error) {
    throw new Error(`getSwap: ${error}`);
  }
}
