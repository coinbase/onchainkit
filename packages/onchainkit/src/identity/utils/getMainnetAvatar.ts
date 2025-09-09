import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { mainnet } from 'viem/chains';
import { normalize } from 'viem/ens';

/**
 * Get ENS avatar from Ethereum mainnet for an ENS name
 */
export const getMainnetAvatar = async (
  ensName: string,
): Promise<string | null> => {
  if (!ensName) {
    return null;
  }

  try {
    const client = getChainPublicClient(mainnet);

    const mainnetEnsAvatar = await client.getEnsAvatar({
      name: normalize(ensName),
    });

    if (mainnetEnsAvatar) {
      return mainnetEnsAvatar;
    }

    return null;
  } catch (error) {
    console.error('ENS avatar resolution failed:', error);
    return null;
  }
};
