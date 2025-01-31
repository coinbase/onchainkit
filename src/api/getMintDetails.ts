import { CDP_GET_MINT_DETAILS } from '../core/network/definitions/nft';
import { type JSONRPCContext, sendRequest } from '../core/network/request';
import type { GetMintDetailsParams, GetMintDetailsResponse } from './types';

/**
 * Retrieves mint details for an NFT contract and token ID
 */
export async function getMintDetails(
  params: GetMintDetailsParams,
  _context: JSONRPCContext = 'api',
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
      _context,
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
