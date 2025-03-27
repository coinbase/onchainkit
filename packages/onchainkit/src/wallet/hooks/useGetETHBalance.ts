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
