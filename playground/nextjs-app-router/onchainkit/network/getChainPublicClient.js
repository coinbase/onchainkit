import { createPublicClient, http } from 'viem';
function getChainPublicClient(chain) {
  return createPublicClient({
    chain: chain,
    transport: http()
  });
}
export { getChainPublicClient };
//# sourceMappingURL=getChainPublicClient.js.map
