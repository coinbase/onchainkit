import type { Address } from 'viem';
import { useValue } from '../../internal/hooks/useValue';
import type { Token } from '../../token';
import { useGetETHBalance } from '../../wallet/hooks/useGetETHBalance';
import { useGetTokenBalance } from '../../wallet/hooks/useGetTokenBalance';

export function useSwapBalances({
  address,
  fromToken,
  toToken,
}: {
  address: Address;
  fromToken?: Token;
  toToken?: Token;
}) {
  const { convertedBalance: convertedEthBalance, error: ethBalanceError } =
    useGetETHBalance(address);

  const { convertedBalance: convertedFromBalance, error: fromBalanceError } =
    useGetTokenBalance(address, fromToken);

  const { convertedBalance: convertedToBalance, error: toBalanceError } =
    useGetTokenBalance(address, toToken);

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
  });
}
