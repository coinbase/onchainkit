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

export function useGetETHBalance(address?: Address): UseGetETHBalanceResponse {
  const ethBalanceResponse: UseBalanceReturnType = useBalance({
    address,
    query: {
      gcTime: DEFAULT_QUERY_OPTIONS.gcTime,
      staleTime: DEFAULT_QUERY_OPTIONS.staleTime,
      refetchOnWindowFocus: DEFAULT_QUERY_OPTIONS.refetchOnWindowFocus,
    },
  });

  // Log cache hits/misses
  useMemo(() => {
    if (ethBalanceResponse.isSuccess) {
      console.log(`[useGetETHBalance] Query SUCCESS - Data loaded`);
    }
    if (ethBalanceResponse.isError) {
      console.error(
        `[useGetETHBalance] Query ERROR:`,
        ethBalanceResponse.error,
      );
    }
  }, [
    ethBalanceResponse.isSuccess,
    ethBalanceResponse.isError,
    ethBalanceResponse.error,
  ]);

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
        error,
        response: ethBalanceResponse,
      };
    }

    const formattedBalance = formatUnits(
      ethBalanceResponse?.data?.value ?? 0n,
      ETH_DECIMALS,
    );
    const convertedBalance = getRoundedAmount(formattedBalance, 8);

    return {
      convertedBalance,
      error,
      response: ethBalanceResponse,
    };
  }, [ethBalanceResponse]);
}
