import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const publicClient: ReturnType<typeof createPublicClient> = createPublicClient({
  chain: mainnet,
  transport: http(),
});
