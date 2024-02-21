import { isFailedFrameApiResponse } from '../utils/syndicateFrameApi';
import {
  CreateFrameApiKey,
  CreateFrameApiKeyFetchResponse,
  CreateFrameApiKeyResponse,
} from './types';

/**
 * Create a API key to access Syndicate Frame API
 *
 * @param chainId The chain you want to create the API key for, currently Base mainnet and Syndicate Frame chain are supported
 * @returns A promise that either resolves to the API key to access the Syndicate Frame API or undefined if there is an error
 */
export async function createFrameApiKey(
  args: CreateFrameApiKey,
): Promise<CreateFrameApiKeyResponse> {
  const { chainId } = args;

  try {
    if (chainId !== 5101 && chainId !== 8453) {
      throw new Error(
        'Chain is not supported, only Base mainnet and Syndicate Frame chain are supported.',
      );
    }

    const res = await fetch('https://frame.syndicate.io/api/v2/createApiKey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chainId }),
    });

    const json = (await res.json()) as CreateFrameApiKeyFetchResponse;

    if (isFailedFrameApiResponse(json)) {
      throw new Error(json.error);
    }

    return json.data.apiKey;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Syndicate Frame API error - Create API key: ${error.message}`);
    }
    console.error('Syndicate Frame API error - Create API key: Unknown error occurred');

    return undefined;
  }
}
