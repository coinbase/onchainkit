import { type Address, formatUnits } from 'viem';
import { erc20Abi } from 'viem';
import type { Config } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { CONTRACT_METHODS, USDC_ADDRESS_BASE } from '../constants';

export const getUSDCBalance = async ({
  address,
  config,
}: {
  address: Address;
  config: Config;
}) => {
  const result = await readContract(config, {
    abi: erc20Abi,
    address: USDC_ADDRESS_BASE,
    functionName: CONTRACT_METHODS.BALANCE_OF,
    args: [address],
  });

  return formatUnits(result, 6);
};
