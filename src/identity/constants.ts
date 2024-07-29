import { base, baseSepolia } from 'viem/chains';
import type { ResolverAddressesByChainIdMap } from './types';

export const RESOLVER_ADDRESSES_BY_CHAIN_ID: ResolverAddressesByChainIdMap = {
  [baseSepolia.id]: '0x6533C94869D28fAA8dF77cc63f9e2b2D6Cf77eBA',
  [base.id]: '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD',
};
