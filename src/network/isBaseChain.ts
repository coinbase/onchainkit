import { base, baseSepolia } from 'viem/chains';

export const BASE_CHAINS_IDS: number[] = [base.id, baseSepolia.id];

export function isBaseChain(chainId: number) {
  return BASE_CHAINS_IDS.includes(chainId);
}
