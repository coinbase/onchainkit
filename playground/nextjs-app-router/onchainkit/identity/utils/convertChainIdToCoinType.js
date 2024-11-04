import { mainnet } from 'viem/chains';

/**
 * Convert an chainId to a coinType hex for reverse chain resolution
 */
const convertChainIdToCoinType = chainId => {
  // L1 resolvers to addr
  if (chainId === mainnet.id) {
    return 'addr';
  }
  const cointype = (0x80000000 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
};
export { convertChainIdToCoinType };
//# sourceMappingURL=convertChainIdToCoinType.js.map
