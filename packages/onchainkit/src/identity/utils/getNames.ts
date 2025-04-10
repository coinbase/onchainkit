import type { Basename, GetNameReturnType, GetNames } from '@/identity/types';
import { base, mainnet } from 'viem/chains';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';
import { isBase } from '../../core/utils/isBase';
import { isEthereum } from '../../core/utils/isEthereum';
import L2ResolverAbi from '../abis/L2ResolverAbi';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';
import { getAddress } from './getAddress';

/**
 * An asynchronous function to fetch multiple Basenames or Ethereum Name Service (ENS)
 * names for a given array of Ethereum addresses in a single batch request.
 * It returns an array of ENS names in the same order as the input addresses.
 */
// eslint-disable-next-line complexity
export const getNames = async ({
  addresses,
  chain = mainnet,
}: GetNames): Promise<GetNameReturnType[]> => {
  if (!addresses || addresses.length === 0) {
    return [];
  }

  const chainIsBase = isBase({ chainId: chain.id });
  const chainIsEthereum = isEthereum({ chainId: chain.id });
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;

  if (!chainSupportsUniversalResolver) {
    return Promise.reject(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );
  }

  const client = getChainPublicClient(chain);
  const results: GetNameReturnType[] = Array(addresses.length).fill(null);

  if (chainIsBase) {
    try {
      // Create batch of calls for the multicall contract
      const calls = addresses.map((address) => ({
        address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
        abi: L2ResolverAbi,
        functionName: 'name',
        args: [convertReverseNodeToBytes(address, chain.id)],
      }));

      const batchResults = await client.multicall({
        contracts: calls,
        allowFailure: true,
      });

      for (let index = 0; index < batchResults.length; index++) {
        const result = batchResults[index];
        if (result.status === 'success' && result.result) {
          const basename = result.result as Basename;
          try {
            // Verify basename with forward resolution
            const resolvedAddress = await getAddress({
              name: basename,
              chain: base,
            });

            if (
              resolvedAddress &&
              resolvedAddress.toLowerCase() === addresses[index].toLowerCase()
            ) {
              results[index] = basename;
            }
          } catch (error) {
            console.error(
              `Error during basename forward resolution verification for ${addresses[index]}:`,
              error,
            );
          }
        }
      }

      // If we have all results, return them
      if (results.every((result) => result !== null)) {
        return results;
      }
    } catch (error) {
      console.error('Error resolving Base names in batch:', error);
    }
  }

  // Default fallback to mainnet
  // ENS resolution is not well-supported on Base, so want to ensure that we fall back to mainnet
  const fallbackClient = getChainPublicClient(mainnet);

  // For addresses that don't have a result yet, try ENS resolution on mainnet
  const unresolvedIndices = results
    .map((result, index) => (result === null ? index : -1))
    .filter((index) => index !== -1);

  if (unresolvedIndices.length > 0) {
    try {
      const ensPromises = unresolvedIndices.map((index) =>
        fallbackClient
          .getEnsName({
            address: addresses[index],
          })
          .catch((error) => {
            console.error(
              `Error resolving ENS name for ${addresses[index]}:`,
              error,
            );
            return null; // Return null for failed resolutions
          }),
      );

      const ensResults = await Promise.all(ensPromises);

      // Update results with ENS names
      for (let i = 0; i < ensResults.length; i++) {
        const ensName = ensResults[i];
        const originalIndex = unresolvedIndices[i];

        if (ensName) {
          try {
            // Verify ENS name with forward resolution
            const resolvedAddress = await getAddress({
              name: ensName,
              chain: mainnet,
            });

            if (
              resolvedAddress &&
              resolvedAddress.toLowerCase() ===
                addresses[originalIndex].toLowerCase()
            ) {
              results[originalIndex] = ensName;
            }
          } catch (error) {
            console.error(
              `Error during ENS forward resolution verification for ${addresses[originalIndex]}:`,
              error,
            );
          }
        }
      }
    } catch (error) {
      console.error('Error resolving ENS names in batch:', error);
    }
  }

  return results;
};
