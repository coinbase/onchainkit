import { RequestContext, RequestContextType } from '@/core/network/constants';
import { CDP_MINT_TOKEN } from '../core/network/definitions/nft';
import { sendRequest } from '../core/network/request';
import type {
  BuildMintTransactionParams,
  BuildMintTransactionResponse,
} from './types';
import { buildErrorStruct } from './utils/buildErrorStruct';
import { ApiErrorCode } from './constants';

/**
 * Retrieves contract to mint an NFT
 */
export async function buildMintTransaction(
  params: BuildMintTransactionParams,
  context: RequestContextType = RequestContext.API,
): Promise<BuildMintTransactionResponse> {
  const { mintAddress, tokenId, network = '', quantity, takerAddress } = params;

  try {
    const res = await sendRequest<
      BuildMintTransactionParams,
      BuildMintTransactionResponse
    >(
      CDP_MINT_TOKEN,
      [
        {
          mintAddress,
          network,
          quantity,
          takerAddress,
          tokenId,
        },
      ],
      context,
    );
    if (res.error) {
      return buildErrorStruct({
        code: `${res.error.code}`,
        error: 'Error building mint transaction',
        message: res.error.message,
      });
    }

    return res.result;
  } catch {
    return buildErrorStruct({
      code: ApiErrorCode.UncaughtNft,
      error: 'Something went wrong',
      message: 'Error building mint transaction',
    });
  }
}
