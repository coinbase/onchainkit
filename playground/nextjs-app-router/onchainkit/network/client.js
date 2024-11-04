import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});
export { publicClient };
//# sourceMappingURL=client.js.map
