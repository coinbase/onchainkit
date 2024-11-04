import { getSwapErrorCode } from './getSwapErrorCode.js';
function getTokenBalanceErrorState({
  ethBalance,
  token,
  tokenBalance
}) {
  if (token?.symbol === 'ETH' && ethBalance?.error) {
    return {
      error: ethBalance?.error?.message,
      code: getSwapErrorCode('balance')
    };
  }
  if (token && token?.symbol !== 'ETH' && tokenBalance?.isError) {
    return {
      error: tokenBalance?.error?.shortMessage,
      code: getSwapErrorCode('balance')
    };
  }
}
export { getTokenBalanceErrorState };
//# sourceMappingURL=getTokenBalanceErrorState.js.map
