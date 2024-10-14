import { TRENDING_MINT_URI } from '../constants';
import type { MintCollection } from '../types';

export type TrendingMintCollectionParams = {
  network?: string;
  address?: string;
  takerAddress?: string;
  quantity?: string;
};

export async function getTrendingMint(
  address: string,
  takerAddress?: string,
  network?: string,
): Promise<MintCollection | null> {
  if (!address || !takerAddress) {
    return null;
  }

  const params: TrendingMintCollectionParams = {
    address,
    takerAddress,
  };

  if (network) {
    params.network = network;
  }

  const url = new URL(TRENDING_MINT_URI);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
}
