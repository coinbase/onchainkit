import { defineChain } from 'viem';

export const syndicateFrameChain = defineChain({
  id: 5101,
  name: 'Syndicate Frame Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-frame.syndicate.io'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer-frame.syndicate.io' },
  },
});
