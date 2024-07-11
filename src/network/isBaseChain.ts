import { base, baseSepolia } from 'viem/chains';
import type { Chain } from 'viem/chains';

export const BASE_CHAINS_BY_CHAIN_ID: Record<number, Chain> = {
  [base.id]: base,
  [baseSepolia.id]: baseSepolia,
};

export const BASE_CHAINS_IDS: number[] = Object.keys(
  BASE_CHAINS_BY_CHAIN_ID,
).map((id) => Number(id));

export function isBaseChain(chainId: number) {
  return BASE_CHAINS_IDS.includes(chainId);
}
