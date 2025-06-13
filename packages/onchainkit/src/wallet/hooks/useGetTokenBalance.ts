import { useMemo } from 'react';
import { erc20Abi, formatUnits } from 'viem';
import type { Address } from 'viem';
import { useReadContract } from 'wagmi';
import type { UseReadContractReturnType } from 'wagmi';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import type { SwapError } from '../../swap';
import { getSwapErrorCode } from '../../swap/utils/getSwapErrorCode';
import type { Token } from '../../token';
import type { UseGetTokenBalanceResponse } from '../types';

/**
 * A custom hook that retrieves and formats the balance of an ERC-20 token for a given address.
 *
 * This hook uses `wagmi`'s `useReadContract` to call the `balanceOf` function on the token contract,
 * and returns both the raw and rounded token balance. It also handles loading, error, and refetch states.
 *
 * @param address - The wallet address whose token balance is being fetched.
 * @param token - The ERC-20 token object containing the token's address and decimals.
 *
 * @returns An object containing:
 * - `convertedBalance`: The full precision balance formatted using the token's decimals.
 * - `roundedBalance`: The balance rounded to 8 decimal places for display purposes.
 * - `status`: The status of the balance fetch operation (`idle`, `loading`, `success`, or `error`).
 * - `error`: A `SwapError` object if an error occurred while fetching the balance.
 * - `response`: The original `useReadContract` response from `wagmi`.
 * - `refetch`: A function to manually re-trigger the balance fetch.
 */

export function useGetTokenBalance(
  address?: Address,
  token?: Token,
): UseGetTokenBalanceResponse {
  const tokenBalanceResponse: UseReadContractReturnType = useReadContract({
    abi: erc20Abi,
    address: token?.address as Address,
    functionName: 'balanceOf',
    args: address ? [address] : [],
    query: {
      enabled: !!token?.address && !!address,
    },
  });

  return useMemo(() => {
    let error: SwapError | undefined;
    if (tokenBalanceResponse?.error) {
      error = {
        code: getSwapErrorCode('balance'),
        error: tokenBalanceResponse?.error?.shortMessage,
        message: '',
      };
    }
    if (
      (tokenBalanceResponse?.data !== 0n && !tokenBalanceResponse?.data) ||
      !token
    ) {
      return {
        convertedBalance: '',
        status: tokenBalanceResponse.status,
        error,
        roundedBalance: '',
        response: tokenBalanceResponse,
        refetch: tokenBalanceResponse.refetch,
      };
    }
    const convertedBalance = formatUnits(
      tokenBalanceResponse?.data as bigint,
      token?.decimals,
    );
    return {
      convertedBalance,
      status: tokenBalanceResponse.status,
      error,
      response: tokenBalanceResponse,
      roundedBalance: getRoundedAmount(convertedBalance, 8),
      refetch: tokenBalanceResponse.refetch,
    };
  }, [token, tokenBalanceResponse]);
}
