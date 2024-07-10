import { type Address, encodePacked, keccak256 } from 'viem';
import { ADDRESS_REVERSE_NODE } from '../identity/constants';

// will convert an address to a reverse node (bytes32)
// used for reverse resolution and resolver contract interaction
export const convertReverseNodeToBytes = (address: Address) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const addressReverseNode = keccak256(
    encodePacked(['bytes32', 'bytes32'], [ADDRESS_REVERSE_NODE, addressNode]),
  );
  return addressReverseNode;
};
