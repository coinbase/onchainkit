import { RequestContext } from '@/core/network/constants';
import { CDP_GET_TOKEN_DETAILS } from '../core/network/definitions/nft';
import { sendRequest } from '../core/network/request';
import type { GetTokenDetailsParams, GetTokenDetailsResponse } from './types';

/**
 * Retrieves token details for an NFT contract and token ID
 */
export async function getTokenDetails(
  params: GetTokenDetailsParams,
  _context: RequestContext = RequestContext.API,
): Promise<GetTokenDetailsResponse> {
  const { contractAddress, tokenId } = params;

  try {
    const res = await sendRequest<
      GetTokenDetailsParams,
      GetTokenDetailsResponse
    >(
      CDP_GET_TOKEN_DETAILS,
      [
        {
          contractAddress,
          tokenId,
        },
      ],
      _context,
    );
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error fetching token details',
        message: res.error.message,
      };
    }

    return res.result;
  } catch {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error fetching token details',
    };
  }
}
