import type { Basename, GetName, GetNameReturnType } from '@/identity/types';
import { base, mainnet } from 'viem/chains';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';
import { isBase } from '../../core/utils/isBase';
import { isEthereum } from '../../core/utils/isEthereum';
import L2ResolverAbi from '../abis/L2ResolverAbi';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * name for a given Ethereum address. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */
export const getName = async ({
  address,
  chain = mainnet,
}: GetName): Promise<GetNameReturnType> => {
  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );
  }

  let client = getChainPublicClient(chain);

  if (chainIsBase) {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);
    try {
      const basename = await client.readContract({
        abi: L2ResolverAbi,
        address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
        functionName: 'name',
        args: [addressReverseNode],
      });
      if (basename) {
        return basename as Basename;
      }
    } catch (_error) {
      // This is a best effort attempt, so we don't need to do anything here.
    }
  }

  // Default to mainnet
  client = getChainPublicClient(mainnet);

  // ENS username
  const ensName = await client.getEnsName({
    address,
  });

  return ensName ?? null;
};
