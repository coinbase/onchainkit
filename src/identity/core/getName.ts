import { mainnet } from 'viem/chains';
import type { GetName, GetNameReturnType } from '../types';
import L2ResolverAbi from '../abis/L2ResolverAbi';
import {
  baseChainsIds,
  chainsById,
  ensUniversalResolverChainIds,
  getChainPublicClient,
} from '../../network/getChainPublicClient';
import { resolverAddressesByChainId } from '../constants';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * name for a given Ethereum address. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */

export const getName = async ({
  address,
  chainId = mainnet.id,
}: GetName): Promise<GetNameReturnType> => {
  const chainSupportsUniversalResolver =
    ensUniversalResolverChainIds.includes(chainId);
  const chainIsBase = baseChainsIds.includes(chainId);
  const chain = chainsById[chainId];

  if (!chainSupportsUniversalResolver) {
    throw Error(
      `ChainId not supported, name resolution is only supported on ${ensUniversalResolverChainIds.join(
        ', ',
      )}.`,
    );
  }

  const client = getChainPublicClient(chainId);

  if (chainIsBase) {
    const addressReverseNode = convertReverseNodeToBytes(address);
    const baseEnsName = await client.readContract({
      abi: L2ResolverAbi,
      address: resolverAddressesByChainId[chain.id],
      functionName: 'name',
      args: [addressReverseNode],
    });
    return baseEnsName ?? null;
  }

  // ENS username
  const ensName = await client.getEnsName({
    address,
  });

  return ensName ?? null;
};
