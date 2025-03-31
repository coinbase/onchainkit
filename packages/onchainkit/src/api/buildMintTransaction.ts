import { RequestContext } from '@/core/network/constants';
import { CDP_MINT_TOKEN } from '../core/network/definitions/nft';
import { sendRequest } from '../core/network/request';
import type {
  BuildMintTransactionParams,
  BuildMintTransactionResponse,
} from './types';

/**
 * Retrieves contract to mint an NFT
 */
export async function buildMintTransaction(
  params: BuildMintTransactionParams,
  context: RequestContext = RequestContext.API,
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
      return {
        code: `${res.error.code}`,
        error: 'Error building mint transaction',
        message: res.error.message,
      };
    }

    return res.result;
  } catch {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error building mint transaction',
    };
  }
}
