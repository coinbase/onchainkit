import { useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';
import { getRoundedAmount } from '../../utils/getRoundedAmount';
import { getSwapErrorCode } from '../../swap/core/getSwapErrorCode';
import type { Address } from 'viem';
import type { Token } from '../../token';
import type { UseReadContractReturnType } from 'wagmi';

export function useGetTokenBalance(address: Address, token?: Token) {
  const tokenBalanceResponse: UseReadContractReturnType = useReadContract({
    abi: erc20Abi,
    address: token?.address as Address,
    functionName: 'balanceOf',
    args: [address],
    query: {
      enabled: !!token?.address && !!address,
    },
  });
  return useMemo(() => {
    let error;
    if (tokenBalanceResponse?.error) {
      error = {
        error: tokenBalanceResponse?.error?.shortMessage,
        code: getSwapErrorCode('balance'),
      };
    }
    if (
      (tokenBalanceResponse?.data !== 0n && !tokenBalanceResponse?.data) ||
      !token
    ) {
      return {
        convertedBalance: '',
        error,
        roundedBalance: '',
        response: tokenBalanceResponse,
      };
    }
    const convertedBalance = formatUnits(
      tokenBalanceResponse?.data as bigint,
      token?.decimals,
    );
    return {
      convertedBalance,
      error,
      response: tokenBalanceResponse,
      roundedBalance: getRoundedAmount(convertedBalance, 8),
    };
  }, [token, tokenBalanceResponse]);
}
