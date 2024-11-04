import { formatUnits } from 'viem';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount.js';
function getTokenBalances({
  ethBalance,
  token,
  tokenBalance
}) {
  if (token?.symbol === 'ETH' && (ethBalance || ethBalance === 0n)) {
    const convertedBalance = formatUnits(ethBalance, token?.decimals);
    return {
      convertedBalance: formatUnits(ethBalance, token?.decimals),
      roundedBalance: getRoundedAmount(convertedBalance, 8)
    };
  }
  if (token && token?.symbol !== 'ETH' && (tokenBalance || tokenBalance === 0n)) {
    const convertedBalance = formatUnits(tokenBalance, token?.decimals);
    return {
      convertedBalance,
      roundedBalance: getRoundedAmount(convertedBalance, 8)
    };
  }
  return {
    convertedBalance: '',
    roundedBalance: ''
  };
}
export { getTokenBalances };
//# sourceMappingURL=getTokenBalances.js.map
