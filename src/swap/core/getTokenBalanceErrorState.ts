import { getSwapErrorCode } from './getSwapErrorCode';
import type { Token } from '../../token';
import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';

type GetTokenBalancesErrorStateParams = {
  ethBalance?: UseBalanceReturnType;
  token?: Token;
  tokenBalance?: UseReadContractReturnType;
};

export function getTokenBalanceErrorState({
  ethBalance,
  token,
  tokenBalance,
}: GetTokenBalancesErrorStateParams) {
  if (token?.symbol === 'ETH' && ethBalance?.error) {
    return {
      error: ethBalance?.error?.message,
      code: getSwapErrorCode('balance'),
    };
  }
  if (token && token?.symbol !== 'ETH' && tokenBalance?.isError) {
    return {
      error: tokenBalance?.error?.shortMessage,
      code: getSwapErrorCode('balance'),
    };
  }
}
