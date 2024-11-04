import { erc20Abi, formatUnits } from 'viem';
import { readContract } from 'wagmi/actions';
import { USDC_ADDRESS_BASE, CONTRACT_METHODS } from '../constants.js';
const getUSDCBalance = async ({
  address,
  config
}) => {
  const result = await readContract(config, {
    abi: erc20Abi,
    address: USDC_ADDRESS_BASE,
    functionName: CONTRACT_METHODS.BALANCE_OF,
    args: [address]
  });
  return formatUnits(result, 6);
};
export { getUSDCBalance };
//# sourceMappingURL=getUSDCBalance.js.map
