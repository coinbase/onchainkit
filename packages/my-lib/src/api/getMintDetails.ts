import { RequestContext } from '@/core/network/constants';
import { CDP_GET_MINT_DETAILS } from '../core/network/definitions/nft';
import { sendRequest } from '../core/network/request';
import type { GetMintDetailsParams, GetMintDetailsResponse } from './types';

/**
 * Retrieves mint details for an NFT contract and token ID
 */
export async function getMintDetails(
  params: GetMintDetailsParams,
  context: RequestContext = RequestContext.API,
): Promise<GetMintDetailsResponse> {
  const { contractAddress, takerAddress, tokenId } = params;

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
      context,
    );
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error fetching mint details',
        message: res.error.message,
      };
    }

    return res.result;
  } catch {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error fetching mint details',
    };
  }
}
