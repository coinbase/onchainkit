import { isFailedFrameApiResponse } from '../utils/syndicateFrameApi';
import {
  CreateFrameApiWallet,
  CreateFrameApiWalletFetchResponse,
  CreateFrameApiWalletResponse,
} from './types';

/**
 * Create a wallet that will be used to perform actions onchain on behalf of the authenticated user
 *
 * Currently we only generate 1 wallet per api key but if you would like to have multiple please contact Syndicate
 * @param apiKey A valid API key geneerated from createFrameApiKey
 * @returns A promise that either resolves to the generated wallet address(es) or undefined if there is an error
 */
export async function createFrameApiWallet(
  args: CreateFrameApiWallet,
): Promise<CreateFrameApiWalletResponse> {
  const { apiKey } = args;

  try {
    if (!apiKey) {
      throw new Error(
        'API Key not provided. If you dont have an API key, create one using createFrameApiKey',
      );
    }

    const res = await fetch('https://frame.syndicate.io/api/v2/createWallet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const json = (await res.json()) as CreateFrameApiWalletFetchResponse;

    if (isFailedFrameApiResponse(json)) {
      throw new Error(json.error);
    }

    return json.data.walletAddresses;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Syndicate Frame API error - Create Wallet: ${error.message}`);
    }
    console.error('Syndicate Frame API error - Create Wallet: Unknown error occurred');

    return undefined;
  }
}
