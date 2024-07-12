import { mainnet } from 'viem/chains';
import type { GetName, GetNameReturnType } from '../types';
import L2ResolverAbi from '../abis/L2ResolverAbi';
import { getChainPublicClient } from '../../network/getChainPublicClient';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';
import { isEthereum } from '../../isEthereum';
import { isBase } from '../../isBase';

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
    const addressReverseNode = convertReverseNodeToBytes(address);

    const baseEnsName = await client.readContract({
      abi: L2ResolverAbi,
      address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
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
