import type { Chain } from 'viem';
import type { Config } from 'wagmi';
import { readContract } from 'wagmi/actions';
import { L2OutputOracleABI } from '../abi';
import type { AppchainConfig } from '../types';

export const getOutput = async ({
  config,
  chain,
  wagmiConfig,
}: {
  config: AppchainConfig;
  chain: Chain;
  wagmiConfig: Config;
}) => {
  const outputIndex = await readContract(wagmiConfig, {
    address: config.contracts.l2OutputOracle,
    abi: L2OutputOracleABI,
    functionName: 'latestOutputIndex',
    args: [],
    chainId: chain.id,
  });

  const output = await readContract(wagmiConfig, {
    address: config.contracts.l2OutputOracle,
    abi: L2OutputOracleABI,
    functionName: 'getL2Output',
    args: [outputIndex],
    chainId: chain.id,
  });

  return {
    outputIndex,
    ...output,
  };
};
