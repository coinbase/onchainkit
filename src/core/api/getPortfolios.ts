import { CDP_GET_PORTFOLIO_TOKEN_BALANCES } from '../network/definitions/wallet';
import { sendRequest } from '../network/request';
import type { GetPortfoliosParams, GetPortfoliosResponse } from './types';

export async function getPortfolios({ addresses }: GetPortfoliosParams) {
  try {
    const res = await sendRequest<GetPortfoliosParams, GetPortfoliosResponse>(
      CDP_GET_PORTFOLIO_TOKEN_BALANCES,
      [{ addresses }],
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
