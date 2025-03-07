import type { Address } from 'viem';
import { mainnet } from 'viem/chains';
import { getChainPublicClient } from '../../core/network/getChainPublicClient';
import { isBase } from '../../core/utils/isBase';
import { isEthereum } from '../../core/utils/isEthereum';
import L2ResolverAbi from '../abis/L2ResolverAbi';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';
import type { Basename, GetNameReturnType } from '@/identity/types';

/**
 * Interface for the getNames function parameters
 */
export type GetNames = {
  addresses: Address[];
  chain?: typeof mainnet;
}

/**
 * An asynchronous function to fetch multiple Basenames or Ethereum Name Service (ENS)
 * names for a given array of Ethereum addresses in a single batch request.
 * It returns an array of ENS names in the same order as the input addresses.
 */
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

  // Handle Base chain resolution
  if (chainIsBase) {
    try {
      // Create batch of calls for the multicall contract
      const calls = addresses.map((address) => ({
        address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
        abi: L2ResolverAbi,
        functionName: 'name',
        args: [convertReverseNodeToBytes(address, chain.id)],
      }));

      // Execute batch request
      const batchResults = await client.multicall({
        contracts: calls,
        allowFailure: true,
      });

      // Process results
      batchResults.forEach((result, index) => {
        if (result.status === 'success' && result.result) {
          results[index] = result.result as Basename;
        }
      });

      // If we have all results, return them
      if (results.every((result) => result !== null)) {
        return results;
      }
    } catch (error) {
      // This is a best effort attempt, so we continue to fallback
      console.error('Error resolving Base names in batch:', error);
    }
  }

  // Default fallback to mainnet for any unresolved names
  // ENS resolution is not well-supported on Base, so want to ensure that we fall back to mainnet
  const fallbackClient = getChainPublicClient(mainnet);

  // For addresses that don't have a result yet, try ENS resolution on mainnet
  const unresolvedIndices = results
    .map((result, index) => (result === null ? index : -1))
    .filter((index) => index !== -1);

  if (unresolvedIndices.length > 0) {
    try {
      // Create batch of ENS resolution calls
      const ensPromises = unresolvedIndices.map((index) =>
        fallbackClient.getEnsName({
          address: addresses[index],
        }),
      );

      // Execute all ENS resolution calls
      const ensResults = await Promise.all(ensPromises);

      // Update results with ENS names
      ensResults.forEach((ensName, i) => {
        const originalIndex = unresolvedIndices[i];
        results[originalIndex] = ensName;
      });
    } catch (error) {
      console.error('Error resolving ENS names in batch:', error);
    }
  }

  return results;
};
