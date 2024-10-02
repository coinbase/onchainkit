import { GET_TOKEN_DETAILS_URI } from '../constants';
import type { Collectible, GetTokenDetailsParams } from '../types';

type GetTokenDetails = {
  contractAddress: string;
  tokenId?: string;
  includeFloorPrice?: boolean;
  chainId: number;
  userAddress?: string;
};

export async function getTokenDetails({
  contractAddress,
  tokenId,
  includeFloorPrice = false,
  chainId,
  userAddress,
}: GetTokenDetails): Promise<Collectible | null> {
  const params: GetTokenDetailsParams = {
    contractAddress,
    tokenId: tokenId ?? '1',
    chainId: chainId.toString(),
    includeFloorPrice: includeFloorPrice.toString(),
    ...(userAddress ? { userAddress } : {}),
  };

  const url = new URL(GET_TOKEN_DETAILS_URI);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data;
}
