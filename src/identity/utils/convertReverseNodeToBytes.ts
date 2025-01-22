import { encodePacked, keccak256, namehash } from 'viem';
import type { Address } from 'viem';
import { convertChainIdToCoinType } from './convertChainIdToCoinType';

/**
 * Convert an address to a reverse node for ENS resolution
 */
export const convertReverseNodeToBytes = (
  address: Address,
  chainId: number,
) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(
    `${chainCoinType.toLocaleUpperCase()}.reverse`,
  );
  const addressReverseNode = keccak256(
    encodePacked(['bytes32', 'bytes32'], [baseReverseNode, addressNode]),
  );
  return addressReverseNode;
};
