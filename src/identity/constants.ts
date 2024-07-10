import type { Address } from 'viem';
import { base, baseSepolia } from 'viem/chains';

export const ADDRESS_REVERSE_NODE =
  '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2';

type AddressMap = Record<number, Address>;

export const resolverAddressesByChainId: AddressMap = {
  [baseSepolia.id]: '0x8d2D30cdE6c46BC81824d0732cE8395c58da3939',
  [base.id]: '0x', // TODO: Update when live
};
