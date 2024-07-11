import { mainnet } from 'viem/chains';
import type { GetName, GetNameReturnType } from '../types';
import L2ResolverAbi from '../abis/L2ResolverAbi';
import { getChainPublicClient } from '../../network/getChainPublicClient';
import { RESOLVER_ADDRESSES_BY_CHAIN_ID } from '../constants';
import { convertReverseNodeToBytes } from './convertReverseNodeToBytes';
import {
  BASE_CHAINS_BY_CHAIN_ID,
  isBaseChain,
} from '../../network/isBaseChain';
import {
  ETHEREUM_CHAINS_BY_CHAIN_ID,
  isEthereumChain,
} from '../../network/isEthereumChain';

/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * name for a given Ethereum address. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */

export const getName = async ({
  address,
  chainId = mainnet.id,
}: GetName): Promise<GetNameReturnType> => {
  const chainIsBase = isBaseChain(chainId);
  const chainIsEthereum = isEthereumChain(chainId);
  const chainSupportsUniversalResolver = chainIsEthereum || chainIsBase;

  if (!chainSupportsUniversalResolver) {
    throw Error(
      'ChainId not supported, name resolution is only supported on Ethereum and Base.',
    );
  }

  if (chainIsBase) {
    const chain = BASE_CHAINS_BY_CHAIN_ID[chainId];
    const client = getChainPublicClient(chain);
    const addressReverseNode = convertReverseNodeToBytes(address);

    const baseEnsName = await client.readContract({
      abi: L2ResolverAbi,
      address: RESOLVER_ADDRESSES_BY_CHAIN_ID[chain.id],
      functionName: 'name',
      args: [addressReverseNode],
    });
    return baseEnsName ?? null;
  }

  const chain = ETHEREUM_CHAINS_BY_CHAIN_ID[chainId];
  const client = getChainPublicClient(chain);

  // ENS username
  const ensName = await client.getEnsName({
    address,
  });

  return ensName ?? null;
};
