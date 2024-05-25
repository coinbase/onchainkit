// 🌲☀️🌲

import { Address } from 'viem';

export type Token = {
  name: string;
  currencyCode: string;
  imageURL: string;
  blockchain: string;
  address: Address;
  chainId: number;
  decimals: number;
  uuid: string;
};

export type TokenChipReact = {
  token: Token;
  onClick: (token: Token) => void;
};
