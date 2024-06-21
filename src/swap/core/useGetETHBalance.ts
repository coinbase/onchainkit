import { useMemo } from 'react';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { getRoundedAmount } from '../../utils/getRoundedAmount';
import type { Address } from 'viem';

const ETH_DECIMALS = 18;
export function useGetETHBalance(address: Address) {
  const ethBalanceResponse = useBalance({ address });

  return useMemo(() => {
    if (!ethBalanceResponse?.data?.value) {
      return { convertedBalance: '', ethBalanceResponse, roundedBalance: '' };
    }
    const convertedBalance = formatUnits(
      ethBalanceResponse?.data?.value,
      ETH_DECIMALS,
    );
    const roundedBalance = getRoundedAmount(convertedBalance, 8);
    return {
      convertedBalance,
      ethBalanceResponse,
      roundedBalance,
    };
  }, [ethBalanceResponse?.data, address]);
}
