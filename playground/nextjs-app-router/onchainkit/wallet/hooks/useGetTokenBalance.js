import { useMemo } from 'react';
import { erc20Abi, formatUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount.js';
import { getSwapErrorCode } from '../../swap/utils/getSwapErrorCode.js';
function useGetTokenBalance(address, token) {
  const tokenBalanceResponse = useReadContract({
    abi: erc20Abi,
    address: token?.address,
    functionName: 'balanceOf',
    args: address ? [address] : [],
    query: {
      enabled: !!token?.address && !!address
    }
  });
  return useMemo(() => {
    let error;
    if (tokenBalanceResponse?.error) {
      error = {
        code: getSwapErrorCode('balance'),
        error: tokenBalanceResponse?.error?.shortMessage,
        message: ''
      };
    }
    if (tokenBalanceResponse?.data !== 0n && !tokenBalanceResponse?.data || !token) {
      return {
        convertedBalance: '',
        error,
        roundedBalance: '',
        response: tokenBalanceResponse
      };
    }
    const convertedBalance = formatUnits(tokenBalanceResponse?.data, token?.decimals);
    return {
      convertedBalance,
      error,
      response: tokenBalanceResponse,
      roundedBalance: getRoundedAmount(convertedBalance, 8)
    };
  }, [token, tokenBalanceResponse]);
}
export { useGetTokenBalance };
//# sourceMappingURL=useGetTokenBalance.js.map
