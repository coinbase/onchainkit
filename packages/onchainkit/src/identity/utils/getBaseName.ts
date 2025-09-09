import { getChainPublicClient } from '@/core/network/getChainPublicClient';
import { isBase } from '@/core/utils/isBase';
import type { Address, Chain } from 'viem';
import { base } from 'viem/chains';
import L2ResolverAbi from '../abis/L2ResolverAbi';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';
import { getAddress } from './getAddress';
import type { Basename } from '../types';

/**
 * Get Base chain name (Basename) for an Ethereum address
 */
export const getBaseName = async (
  address: Address,
  chain: Chain,
): Promise<string | Basename | null> => {
  if (!address || !chain || !isBase({ chainId: chain.id })) {
    return null;
  }

  try {
    const client = getChainPublicClient(chain);
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);

    const basename = (await client.readContract({
      abi: L2ResolverAbi,
      address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
      functionName: 'name',
      args: [addressReverseNode],
    })) as Basename;

    if (!basename) {
      return null;
    }

    try {
      const resolvedAddress = await getAddress({
        name: basename,
      });

      if (
        resolvedAddress &&
        resolvedAddress.toLowerCase() === address.toLowerCase()
      ) {
        return basename;
      }
    } catch (error) {
      console.error(
        'Error during basename forward resolution verification:',
        error,
      );
    }

    return null;
  } catch (error) {
    console.error('Base chain name resolution failed:', error);
    return null;
  }
};
