import { CDP_MINT_TOKEN } from '../network/definitions/nft';
import { sendRequest } from '../network/request';
import type { MintTokenParams, MintTokenResponse } from './types';

/**
 * Retrieves token details for an NFT contract and token ID
 */
export async function mintToken({
  mintAddress,
  network,
  quantity,
  takerAddress,
}: MintTokenParams): Promise<MintTokenResponse> {
  try {
    const res = await sendRequest<MintTokenParams, MintTokenResponse>(
      CDP_MINT_TOKEN,
      [
        {
          mintAddress,
          network,
          quantity,
          takerAddress,
        },
      ],
    );
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error minting token',
        message: res.error.message,
      };
    }

    return res.result;
  } catch (_error) {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error minting token',
    };
  }
}
