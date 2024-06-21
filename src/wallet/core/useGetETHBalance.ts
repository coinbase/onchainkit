import { useMemo } from 'react';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { getRoundedAmount } from '../../utils/getRoundedAmount';
import { getSwapErrorCode } from '../../swap/core/getSwapErrorCode';
import type { Address } from 'viem';
import type { UseBalanceReturnType } from 'wagmi';
import type { SwapError } from '../../swap';
import type { UseGetETHBalanceResponse } from '../types';

const ETH_DECIMALS = 18;

export function useGetETHBalance(address: Address): UseGetETHBalanceResponse {
  const ethBalanceResponse: UseBalanceReturnType = useBalance({ address });

  return useMemo(() => {
    let error: SwapError | undefined;
    if (ethBalanceResponse?.error) {
      error = {
        error: ethBalanceResponse?.error?.message,
        code: getSwapErrorCode('balance'),
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
        roundedBalance: '',
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
