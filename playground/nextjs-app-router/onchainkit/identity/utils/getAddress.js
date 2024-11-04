import { mainnet } from 'viem/chains';
import { getChainPublicClient } from '../../network/getChainPublicClient.js';

/**
 * Get address from ENS name or Basename.
 */
const getAddress = async ({
  name,
  chain = mainnet
}) => {
  const client = getChainPublicClient(chain);
  // Gets address for ENS name.
  const address = await client.getEnsAddress({
    name
  });
  return address ?? null;
};
export { getAddress };
//# sourceMappingURL=getAddress.js.map
