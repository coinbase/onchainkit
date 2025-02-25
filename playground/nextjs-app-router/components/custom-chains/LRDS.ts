import { defineChain } from 'viem';

export const LRDS_CHAIN = defineChain({
  id: 845320008,
  name: 'Blocklords',
  nativeCurrency: {
    name: 'Blocklords',
    symbol: 'LRDS',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://lordchain-rpc-testnet.appchain.base.org'],
    },
  },
});
