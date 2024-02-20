import { isFailedFrameApiResponse } from '../utils/syndicateFrameApi';
import {
  GetFrameApiTxHash,
  GetFrameApiTxHashFetchResponse,
  GetFrameApiTxHashResponse,
} from './types';

/**
 * Gets the transaction hash of a transaction that was sent using the Frame API
 *
 * You may need to call this multiple times until the transaction is in a queued state, if it returns
 *
 * @param apiKey A valid API key geneerated from createFrameApiKey
 * @param transactionId The transaction ID of the transaction you want to get the hash for, this is returned in the sendFrameApiTransaction response
 * @returns A promise that either resolves to the transaction hash or null if transaction hasnt been processed in the queue or undefined if there is an error
 */
export async function getFrameApiTxHash(
  args: GetFrameApiTxHash,
): Promise<GetFrameApiTxHashResponse> {
  const { apiKey, transactionId } = args;

  try {
    if (!apiKey) {
      throw new Error(
        'API Key not provided. If you dont have an API key, create one using createFrameApiKey',
      );
    }

    const res = await fetch(`https://frame.syndicate.io/api/v2/transaction/${transactionId}/hash`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const json = (await res.json()) as GetFrameApiTxHashFetchResponse;

    if (isFailedFrameApiResponse(json)) {
      throw new Error(json.error);
    }

    return json.data.transactionHash;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Syndicate Frame API error - Get Transaction Hash: ${error.message}`);
    }
    console.error('Syndicate Frame API error - Get Transaction Hash: Unknown error occurred');

    return undefined;
  }
}
