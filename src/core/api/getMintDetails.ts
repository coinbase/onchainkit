import { CDP_GET_MINT_DETAILS } from '../network/definitions/nft';
import { sendRequest } from '../network/request';
import type { GetMintDetailsParams, GetMintDetailsResponse } from './types';

/**
 * Retrieves mint details for an NFT contract and token ID
 */
export async function getMintDetails({
  contractAddress,
  takerAddress,
  tokenId,
}: GetMintDetailsParams): Promise<GetMintDetailsResponse> {
  try {
    const res = await sendRequest<GetMintDetailsParams, GetMintDetailsResponse>(
      CDP_GET_MINT_DETAILS,
      [
        {
          contractAddress,
          takerAddress,
          tokenId,
        },
      ],
    );
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error fetching mint details',
        message: res.error.message,
      };
    }

    return res.result;
  } catch (_error) {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error fetching mint details',
    };
  }
}
