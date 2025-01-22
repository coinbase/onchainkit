import { CDP_GET_PORTFOLIO_TOKEN_BALANCES } from '@/core/network/definitions/wallet';
import { sendRequest } from '@/core/network/request';
import type {
  GetPortfolioTokenBalancesParams,
  GetPortfoliosAPIResponse,
} from './types';

export async function getPortfolioTokenBalances({
  addresses,
}: GetPortfolioTokenBalancesParams) {
  try {
    const res = await sendRequest<
      GetPortfolioTokenBalancesParams,
      GetPortfoliosAPIResponse
    >(CDP_GET_PORTFOLIO_TOKEN_BALANCES, [{ addresses }]);
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
