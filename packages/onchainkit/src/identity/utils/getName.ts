import type { Basename, GetName, GetNameReturnType } from '@/identity/types';
import { base, mainnet } from 'viem/chains';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';
import { isBase } from '../../core/utils/isBase';
import { isEthereum } from '../../core/utils/isEthereum';
import L2ResolverAbi from '../abis/L2ResolverAbi';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';
import { getAddress } from './getAddress';

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

  const client = getChainPublicClient(chain);

  if (chainIsBase) {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);
    try {
      const basename = (await client.readContract({
        abi: L2ResolverAbi,
        address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
        functionName: 'name',
        args: [addressReverseNode],
      })) as Basename;

      // Verify basename with forward resolution
      if (basename) {
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
      }
    } catch {
      // This is a best effort attempt, so we don't need to do anything here.
    }
  }

  // Default fallback to mainnet
  // ENS resolution is not well-supported on Base, so want to ensure that we fall back to mainnet
  const fallbackClient = getChainPublicClient(mainnet);

  try {
    // ENS username
    const ensName = await fallbackClient.getEnsName({
      address,
    });

    // Verify ENS name with forward resolution
    if (ensName) {
      try {
        const resolvedAddress = await getAddress({
          name: ensName,
        });

        if (
          resolvedAddress &&
          resolvedAddress.toLowerCase() === address.toLowerCase()
        ) {
          return ensName;
        }
      } catch (error) {
        console.error(
          'Error during ENS forward resolution verification:',
          error,
        );
      }
    }
  } catch {
    // This is a best effort attempt, so we don't need to do anything here.
  }

  return null;
};
