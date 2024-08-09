import { useMemo } from 'react';
import type { Address } from 'viem';
import type { Token } from '../../token';
import { useGetETHBalance } from '../../wallet/hooks/useGetETHBalance';
import { useGetTokenBalance } from '../../wallet/hooks/useGetTokenBalance';

function useValue<T>(object: T): T {
  return useMemo(() => object, [object]);
}

export function useSwapBalances({
  address,
  fromToken,
  toToken,
}: {
  address: Address;
  fromToken?: Token;
  toToken?: Token;
}) {
  const {
    convertedBalance: convertedEthBalance,
    error: ethBalanceError,
    response: ethBalanceResponse,
  } = useGetETHBalance(address);

  const {
    convertedBalance: convertedFromBalance,
    error: fromBalanceError,
    response: fromBalanceResponse,
  } = useGetTokenBalance(address, fromToken);

  const {
    convertedBalance: convertedToBalance,
    error: toBalanceError,
    response: toBalanceResponse,
  } = useGetTokenBalance(address, toToken);

  const isFromNativeToken = fromToken?.symbol === 'ETH';
  const isToNativeToken = toToken?.symbol === 'ETH';

  const fromBalanceString = isFromNativeToken
    ? convertedEthBalance
    : convertedFromBalance;
  const fromTokenBalanceError = isFromNativeToken
    ? ethBalanceError
    : fromBalanceError;
  const toBalanceString = isToNativeToken
    ? convertedEthBalance
    : convertedToBalance;
  const toTokenBalanceError = isToNativeToken
    ? ethBalanceError
    : toBalanceError;

  return useValue({
    fromBalanceString,
    fromTokenBalanceError,

    toBalanceString,
    toTokenBalanceError,

    refetchBalances: async () => {
      await Promise.all([
        ethBalanceResponse?.refetch(),
        fromBalanceResponse?.refetch(),
        toBalanceResponse?.refetch(),
      ]);
    },
  });
}
