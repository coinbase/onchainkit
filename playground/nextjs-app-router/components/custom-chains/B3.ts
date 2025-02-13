import { defineChain } from 'viem';

export const B3_CHAIN = defineChain({
  id: 4087967037,
  name: 'B3 Chain',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://b3-sepolia-rpc.l3.base.org'],
    },
  },
} as const);
