import { encodePacked, keccak256 } from 'viem';
import type { Address } from 'viem';
import { ADDRESS_REVERSE_NODE } from '../constants';

/**
 * Convert an address to a reverse node for ENS resolution
 */
export const convertReverseNodeToBytes = (address: Address) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const addressReverseNode = keccak256(
    encodePacked(['bytes32', 'bytes32'], [ADDRESS_REVERSE_NODE, addressNode]),
  );
  return addressReverseNode;
};
