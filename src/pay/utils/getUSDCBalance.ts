import { type Address, formatUnits } from 'viem';
import { erc20Abi } from 'viem';
import type { Config } from 'wagmi';
import { readContract } from 'wagmi/actions';

export const getUSDCBalance = async ({
  address,
  config,
}: {
  address: Address;
  config: Config;
}) => {
  const result = await readContract(config, {
    abi: erc20Abi,
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    functionName: 'balanceOf',
    args: [address!],
  });

  return formatUnits(result, 6);
};
