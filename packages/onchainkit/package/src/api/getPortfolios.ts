import { RequestContext } from '@/core/network/constants';
import { CDP_GET_PORTFOLIO_TOKEN_BALANCES } from '@/core/network/definitions/wallet';
import { sendRequest } from '@/core/network/request';
import type {
  APIError,
  GetPortfoliosParams,
  GetPortfoliosResponse,
} from './types';

/**
 * Retrieves the portfolios for the provided addresses
 * Supported networks: Base mainnet and Ethereum mainnet
 */
export async function getPortfolios(
  params: GetPortfoliosParams,
  _context: RequestContext = RequestContext.API,
): Promise<GetPortfoliosResponse | APIError> {
  const { addresses } = params;

  try {
    const res = await sendRequest<GetPortfoliosParams, GetPortfoliosResponse>(
      CDP_GET_PORTFOLIO_TOKEN_BALANCES,
      [{ addresses }],
      _context,
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
