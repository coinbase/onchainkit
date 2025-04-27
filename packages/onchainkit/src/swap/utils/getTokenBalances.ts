import { formatUnits } from 'viem';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import type { Token } from '../../token';

type GetTokenBalancesParams = {
  token?: Token;
  tokenBalance?: bigint;
  ethBalance?: bigint;
};

export function getTokenBalances({
  ethBalance,
  token,
  tokenBalance,
}: GetTokenBalancesParams) {
  if (token?.symbol === 'ETH' && (ethBalance || ethBalance === 0n)) {
    const convertedBalance = formatUnits(ethBalance, token?.decimals);
    return {
      convertedBalance: formatUnits(ethBalance, token?.decimals),
      roundedBalance: getRoundedAmount(convertedBalance, 8),
    };
  }
  if (
    token &&
    token?.symbol !== 'ETH' &&
    (tokenBalance || tokenBalance === 0n)
  ) {
    const convertedBalance = formatUnits(tokenBalance, token?.decimals);
    return {
      convertedBalance,
      roundedBalance: getRoundedAmount(convertedBalance, 8),
    };
  }
  return { convertedBalance: '', roundedBalance: '' };
}
