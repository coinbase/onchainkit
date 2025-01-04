import { CDP_GET_PORTFOLIO_TOKEN_BALANCES } from '../network/definitions/wallet';
import { sendRequest } from '../network/request';
import type {
  GetPortfolioTokenBalancesParams,
  GetPortfolioTokenBalancesResponse,
} from './types';

export async function getPortfolioTokenBalances({
  addresses,
}: GetPortfolioTokenBalancesParams) {
  try {
    const res = await sendRequest<
      GetPortfolioTokenBalancesParams,
      GetPortfolioTokenBalancesResponse
    >(CDP_GET_PORTFOLIO_TOKEN_BALANCES, [{ addresses }]);
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error fetching portfolio token balances',
        message: res.error.message,
      };
    }
    return res.result;
  } catch (_error) {
    return {
      code: 'uncaught-portfolio',
      error: 'Something went wrong',
      message: `Error fetching portfolio token balances: ${_error}`,
    };
  }
}
