import { createPublicClient } from 'viem';
import { mainnet } from 'viem/chains';
import { getChainPublicClient } from './getChainPublicClient';

export const publicClient: ReturnType<typeof createPublicClient> =
  getChainPublicClient(mainnet);
