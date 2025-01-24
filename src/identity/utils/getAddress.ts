import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { isBase } from '@/core/utils/isBase';
import { isEthereum } from '@/core/utils/isEthereum';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '@/identity/constants';
import type { GetAddress, GetAddressReturnType } from '@/identity/types';
import { isBasename } from '@/identity/utils/isBasename';
import { mainnet } from 'viem/chains';

/**
 * Get address from ENS name or Basename.
 */
export const getAddress = async ({
  name,
  chain = mainnet,
}: GetAddress): Promise<GetAddressReturnType> => {
  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );
  }

  const client = getChainPublicClient(chain);
  // Gets address for ENS name.
  const address = await client.getEnsAddress({
    name,
    universalResolverAddress: isBasename(name)
      ? RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id]
      : undefined,
  });
  return address ?? null;
};
