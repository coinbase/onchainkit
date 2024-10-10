import { MINT_TOKEN_URI } from '../constants';
import type {
  GetMintToken,
  GetMintTokenResponse,
  MintTokenParams,
} from '../types';

export async function getMintToken({
  mintAddress,
  takerAddress,
  network = 'undefined',
  quantity,
  tokenId,
}: GetMintToken): Promise<GetMintTokenResponse | null> {
  if (!mintAddress || !takerAddress) {
    return null;
  }
  try {
    const payload: MintTokenParams = {
      bypassSimulation: false, // TODO: what do bypassSimulation and loadTest do?
      loadTest: false,
      mintAddress,
      network,
      quantity,
      takerAddress,
    };

    // TokenId is omitted for ERC-721, but required for ERC-1155
    if (tokenId !== 'undefined' && tokenId !== undefined) {
      payload.tokenId = tokenId;
    }

    const url = new URL(MINT_TOKEN_URI);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch(error: unknown) {
    if (error instanceof Error) {
      console.error('getMintToken error', error);
    }
    return null;
  }
}
