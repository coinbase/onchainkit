import { isFailedFrameApiResponse } from '../utils/syndicateFrameApi';
import {
  GetFrameApiWallets,
  GetFrameApiWalletsFetchResponse,
  GetFrameApiWalletsResponse,
} from './types';

/**
 * Gets all wallets associated with a given API key
 *
 * By default this will be 1 wallet but we can provision more if needed
 *
 * @param apiKey A valid API key geneerated from createFrameApiKey
 * @returns A promise that either resolves to the wallet address(es) for this API key or undefined if there is an error
 */
export async function getFrameApiWallets(
  args: GetFrameApiWallets,
): Promise<GetFrameApiWalletsResponse> {
  const { apiKey } = args;

  try {
    if (!apiKey) {
      throw new Error(
        'API Key not provided. If you dont have an API key, create one using createFrameApiKey',
      );
    }

    const res = await fetch('https://frame.syndicate.io/api/v2/getWallets', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const json = (await res.json()) as GetFrameApiWalletsFetchResponse;

    if (isFailedFrameApiResponse(json)) {
      throw new Error(json.error);
    }

    return json.data.walletAddresses;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Syndicate Frame API error - Get Wallets: ${error.message}`);
    }
    console.error('Syndicate Frame API error - Get Wallets: Unknown error occurred');

    return undefined;
  }
}
