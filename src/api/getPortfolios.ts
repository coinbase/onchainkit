import { CDP_GET_PORTFOLIO_TOKEN_BALANCES } from '@/core/network/definitions/wallet';
import { type JSONRPCReferrer, sendRequest } from '@/core/network/request';
import type {
  APIError,
  GetPortfoliosParams,
  GetPortfoliosResponse,
} from './types';

/**
 * Retrieves the portfolios for the provided addresses
 */
export async function getPortfolios(
  params: GetPortfoliosParams,
  _referrer: JSONRPCReferrer = 'api',
): Promise<GetPortfoliosResponse | APIError> {
  const { addresses } = params;

  try {
    const res = await sendRequest<GetPortfoliosParams, GetPortfoliosResponse>(
      CDP_GET_PORTFOLIO_TOKEN_BALANCES,
      [{ addresses }],
      _referrer,
    );
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error fetching portfolio token balances',
        message: res.error.message,
      };
    }
    return res.result;
  } catch (error) {
    return {
      code: 'uncaught-portfolio',
      error: 'Something went wrong',
      message: `Error fetching portfolio token balances: ${error}`,
    };
  }
}
