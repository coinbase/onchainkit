import { useValue } from '../../internal/hooks/useValue.js';
import { useGetETHBalance } from '../../wallet/hooks/useGetETHBalance.js';
import { useGetTokenBalance } from '../../wallet/hooks/useGetTokenBalance.js';
function useSwapBalances({
  address,
  fromToken,
  toToken
}) {
  const _useGetETHBalance = useGetETHBalance(address),
    convertedEthBalance = _useGetETHBalance.convertedBalance,
    ethBalanceError = _useGetETHBalance.error,
    ethBalanceResponse = _useGetETHBalance.response;
  const _useGetTokenBalance = useGetTokenBalance(address, fromToken),
    convertedFromBalance = _useGetTokenBalance.convertedBalance,
    fromBalanceError = _useGetTokenBalance.error,
    _fromTokenResponse = _useGetTokenBalance.response;
  const _useGetTokenBalance2 = useGetTokenBalance(address, toToken),
    convertedToBalance = _useGetTokenBalance2.convertedBalance,
    toBalanceError = _useGetTokenBalance2.error,
    _toTokenResponse = _useGetTokenBalance2.response;
  const isFromNativeToken = fromToken?.symbol === 'ETH';
  const isToNativeToken = toToken?.symbol === 'ETH';
  const fromBalanceString = isFromNativeToken ? convertedEthBalance : convertedFromBalance;
  const fromTokenBalanceError = isFromNativeToken ? ethBalanceError : fromBalanceError;
  const toBalanceString = isToNativeToken ? convertedEthBalance : convertedToBalance;
  const toTokenBalanceError = isToNativeToken ? ethBalanceError : toBalanceError;
  const fromTokenResponse = isFromNativeToken ? ethBalanceResponse : _fromTokenResponse;
  const toTokenResponse = isToNativeToken ? ethBalanceResponse : _toTokenResponse;
  return useValue({
    fromBalanceString,
    fromTokenBalanceError,
    fromTokenResponse,
    toBalanceString,
    toTokenBalanceError,
    toTokenResponse
  });
}
export { useSwapBalances };
//# sourceMappingURL=useSwapBalances.js.map
