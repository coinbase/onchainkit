import { CDP_GET_TOKEN_DETAILS } from '../network/definitions/nft';
import { sendRequest } from '../network/request';
import type { GetTokenDetailsParams, GetTokenDetailsResponse } from './types';

/**
 * Retrieves token details for an NFT contract and token ID
 */
export async function getTokenDetails({
  contractAddress,
  tokenId,
}: GetTokenDetailsParams): Promise<GetTokenDetailsResponse> {
  try {
    const res = await sendRequest<
      GetTokenDetailsParams,
      GetTokenDetailsResponse
    >(CDP_GET_TOKEN_DETAILS, [
      {
        contractAddress,
        tokenId,
      },
    ]);
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error fetching token details',
        message: res.error.message,
      };
    }

    return res.result;
  } catch (_error) {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error fetching token details',
    };
  }
}
