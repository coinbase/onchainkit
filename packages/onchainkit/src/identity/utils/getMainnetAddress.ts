import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { mainnet } from 'viem/chains';

/**
 * Get address from ENS name on Ethereum mainnet
 */
export const getMainnetAddress = async (
  name: string,
): Promise<string | null> => {
  if (!name) {
    return null;
  }

  try {
    const client = getChainPublicClient(mainnet);
    const address = await client.getEnsAddress({ name });
    return address ?? null;
  } catch (error) {
    console.error('Mainnet address resolution failed:', error);
    return null;
  }
};
