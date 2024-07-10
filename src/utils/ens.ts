import { base, baseSepolia } from 'viem/chains';
import { Address, encodePacked, keccak256 } from 'viem';

export const ADDRESS_REVERSE_NODE =
  '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2';

type AddressMap = Record<number, Address>;

export const resolverAddressesByChainId: AddressMap = {
  [baseSepolia.id]: '0x8d2D30cdE6c46BC81824d0732cE8395c58da3939',
  [base.id]: '0x', // TODO: Update when live
};

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
