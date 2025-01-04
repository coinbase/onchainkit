import type { APIError } from '@/core/api/types';
import type { Token } from '@/token';
import type { Address } from 'viem';
import { CDP_GET_PORTFOLIO_TOKEN_BALANCES } from '../network/definitions/wallet';
import { sendRequest } from '../network/request';

export type GetPortfolioTokenBalancesParams = {
  addresses: Address[] | null | undefined;
};

/** Token:
 * address: Address | "";
 * chainId: number;
 * decimals: number;
 * image: string | null;
 * name: string;
 * symbol: string;
 */
export type PortfolioTokenWithFiatValue = Token & {
  crypto_balance: number;
  fiat_balance: number;
};

export type Portfolio = {
  address: Address;
  token_balances: PortfolioTokenWithFiatValue[];
  portfolio_balance_usd: number;
};

export type GetPortfolioTokenBalancesResponse = {
  tokens: Portfolio[] | APIError; // TODO: rename the response key to portfolio
};

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
