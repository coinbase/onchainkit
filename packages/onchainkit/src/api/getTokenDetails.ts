import { RequestContext, RequestContextType } from '@/core/network/constants';
import { CDP_GET_TOKEN_DETAILS } from '../core/network/definitions/nft';
import { sendRequest } from '../core/network/request';
import type { GetTokenDetailsParams, GetTokenDetailsResponse } from './types';
import { ApiErrorCode } from './constants';
import { buildErrorStruct } from './utils/buildErrorStruct';

/**
 * Retrieves token details for an NFT contract and token ID
 */
export async function getTokenDetails(
  params: GetTokenDetailsParams,
  _context: RequestContextType = RequestContext.API,
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
      return buildErrorStruct({
        code: `${res.error.code}`,
        error: 'Error fetching token details',
        message: res.error.message,
      });
    }

    return res.result;
  } catch {
    return buildErrorStruct({
      code: ApiErrorCode.uncaughtNft,
      error: 'Something went wrong',
      message: 'Error fetching token details',
    });
  }
}
