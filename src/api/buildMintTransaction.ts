import { CDP_MINT_TOKEN } from '../network/definitions/nft';
import { sendRequest } from '../network/request';
import type {
  BuildMintTransactionParams,
  BuildMintTransactionResponse,
} from './types';

/**
 * Retrieves contract to mint an nft
 */
export async function buildMintTransaction({
  mintAddress,
  tokenId,
  network = '',
  quantity,
  takerAddress,
}: BuildMintTransactionParams): Promise<BuildMintTransactionResponse> {
  try {
    const res = await sendRequest<
      BuildMintTransactionParams,
      BuildMintTransactionResponse
    >(CDP_MINT_TOKEN, [
      {
        mintAddress,
        network,
        quantity,
        takerAddress,
        tokenId,
      },
    ]);
    if (res.error) {
      return {
        code: `${res.error.code}`,
        error: 'Error building mint transaction',
        message: res.error.message,
      };
    }

    return res.result;
  } catch (_error) {
    return {
      code: 'uncaught-nft',
      error: 'Something went wrong',
      message: 'Error building mint transaction',
    };
  }
}
