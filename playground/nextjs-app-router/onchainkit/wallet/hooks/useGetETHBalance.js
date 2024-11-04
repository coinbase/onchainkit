import { useMemo } from 'react';
import { formatUnits } from 'viem';
import { useBalance } from 'wagmi';
import { getRoundedAmount } from '../../internal/utils/getRoundedAmount.js';
import { getSwapErrorCode } from '../../swap/utils/getSwapErrorCode.js';
const ETH_DECIMALS = 18;
function useGetETHBalance(address) {
  const ethBalanceResponse = useBalance({
    address
  });
  return useMemo(() => {
    let error;
    if (ethBalanceResponse?.error) {
      error = {
        code: getSwapErrorCode('balance'),
        error: ethBalanceResponse?.error?.message,
        message: ''
      };
    }
    if (!ethBalanceResponse?.data?.value && ethBalanceResponse?.data?.value !== 0n) {
      return {
        convertedBalance: '',
        error,
        response: ethBalanceResponse,
        roundedBalance: ''
      };
    }
    const convertedBalance = formatUnits(ethBalanceResponse?.data?.value, ETH_DECIMALS);
    const roundedBalance = getRoundedAmount(convertedBalance, 8);
    return {
      convertedBalance,
      error,
      response: ethBalanceResponse,
      roundedBalance
    };
  }, [ethBalanceResponse]);
}
export { useGetETHBalance };
//# sourceMappingURL=useGetETHBalance.js.map
