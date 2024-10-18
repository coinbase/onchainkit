import { formatUnits } from 'viem';
import { erc20Abi } from 'viem';
import { readContract } from 'wagmi/actions';
import { CONTRACT_METHODS, USDC_ADDRESS_BASE } from '../constants';
import type { GetUSDCBalanceParams } from '../types';

export const getUSDCBalance = async ({
  address,
  config,
}: GetUSDCBalanceParams) => {
  const result = await readContract(config, {
    abi: erc20Abi,
    address: USDC_ADDRESS_BASE,
    functionName: CONTRACT_METHODS.BALANCE_OF,
    args: [address],
  });

  return formatUnits(result, 6);
};
