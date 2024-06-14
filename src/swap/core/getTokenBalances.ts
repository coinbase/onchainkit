import { useMemo } from 'react';
import { getRoundedAmount } from '../../utils/getRoundedAmount';
import { formatUnits } from 'viem';
import type { Token } from '../../token';

type GetTokenBalancesParams = {
  token?: Token;
  ethBalance?: string;
  tokenBalance?: bigint;
};

export function getTokenBalances({
  ethBalance,
  token,
  tokenBalance,
}: GetTokenBalancesParams) {
  return useMemo(() => {
    if (token?.symbol === 'ETH' && ethBalance) {
      return {
        convertedBalance: ethBalance,
        roundedBalance: getRoundedAmount(ethBalance, 8),
      };
    }

    if (token && tokenBalance) {
      const convertedBalance = formatUnits(tokenBalance, token?.decimals);
      return {
        convertedBalance,
        roundedBalance: getRoundedAmount(convertedBalance, 8),
      };
    }
    return { convertedBalance: '', roundedBalance: '' };
  }, [ethBalance, token, tokenBalance]);
}
