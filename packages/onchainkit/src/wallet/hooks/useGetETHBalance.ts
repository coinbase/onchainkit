import { useMemo } from 'react';
import { formatUnits } from 'viem';
import type { Address } from 'viem';
import { useBalance } from 'wagmi';
import type { UseBalanceReturnType } from 'wagmi';
import { DEFAULT_QUERY_OPTIONS } from '../../internal/constants';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount';
import type { SwapError } from '../../swap';
import { getSwapErrorCode } from '../../swap/utils/getSwapErrorCode';
import type { UseGetETHBalanceResponse } from '../types';

const ETH_DECIMALS = 18;

/**
 * A custom hook that retrieves and formats the ETH balance for a given wallet address.
 *
 * This hook uses `wagmi`'s `useBalance` internally and formats the raw balance value
 * into a human-readable string with 18 decimals (ETH standard), along with a rounded
 * version limited to 8 decimal places.
 *
 * It also handles potential balance-fetching errors and returns them in a structured format.
 *
 * @param address - The wallet address for which to fetch the ETH balance.
 * @returns An object containing:
 * - `convertedBalance`: The balance in ETH as a string.
 * - `roundedBalance`: The balance rounded to 8 decimal places.
 * - `error`: An optional `SwapError` object if an error occurred while fetching the balance.
 * - `response`: The original `useBalance` response from `wagmi`.
 */

export function useGetETHBalance(address?: Address): UseGetETHBalanceResponse {
  const ethBalanceResponse: UseBalanceReturnType = useBalance({
    address,
    query: {
      ...DEFAULT_QUERY_OPTIONS,
    },
  });

  return useMemo(() => {
    let error: SwapError | undefined;
    if (ethBalanceResponse?.error) {
      error = {
        code: getSwapErrorCode('balance'),
        error: ethBalanceResponse?.error?.message,
        message: '',
      };
    }
    if (
      !ethBalanceResponse?.data?.value &&
      ethBalanceResponse?.data?.value !== 0n
    ) {
      return {
        convertedBalance: '',
        roundedBalance: '',
        error,
        response: ethBalanceResponse,
      };
    }
    const convertedBalance = formatUnits(
      ethBalanceResponse?.data?.value,
      ETH_DECIMALS,
    );
    const roundedBalance = getRoundedAmount(convertedBalance, 8);
    return {
      convertedBalance,
      error,
      response: ethBalanceResponse,
      roundedBalance,
    };
  }, [ethBalanceResponse]);
}
