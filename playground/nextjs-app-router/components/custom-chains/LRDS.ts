import { defineChain } from 'viem';

export const LRDS_CHAIN = defineChain({
  id: 288669036,
  name: 'Blocklords',
  nativeCurrency: {
    name: 'Blocklords',
    symbol: 'LRDS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://blocklords-sepolia-rpc.l3.base.org'],
    },
  },
});
