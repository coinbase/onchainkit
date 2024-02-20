import { isFailedFrameApiResponse } from '../utils/syndicateFrameApi';
import {
  SendFrameApiTransaction,
  SendFrameApiTransactionFetchResponse,
  SendFrameApiTransactionResponse,
} from './types';

const mandatoryArgs = [
  'apiKey',
  'frameTrustedData',
  'contractAddress',
  'functionSignature',
  'args',
];

/**
 * Send a transaction to be braodcast onchain by the Syndicate Frame API
 *
 * @param apiKey A valid API key geneerated from createFrameApiKey
 * @param frameTrustedData The trusted data blob that is sent by the Frame POST request
 * @param contractAddress The address of the contract to call
 * @param functionSignature The signature of the function to call
 * @param args The arguments to pass to the function
 * @param [shouldLike] Should a user be required to like the frame cast before the tx is sent
 * @param [shouldRecast] Should a user be required to recast the frame before the tx is sent
 * @param [shouldFollow] Should a user be required to follow the frame caster before the tx is sent
 * @returns A promise that either resolves to an object that contains the resolved user address and a transactuion ID or undefined if there is an error
 */
export async function sendFrameApiTransaction(
  args: SendFrameApiTransaction,
): Promise<SendFrameApiTransactionResponse> {
  const {
    apiKey,
    frameTrustedData,
    contractAddress,
    functionSignature,
    args: contractArgs,
    shouldLike = false,
    shouldRecast = false,
    shouldFollow = false,
  } = args;

  try {
    if (!mandatoryArgs.every((key) => key in args)) {
      throw new Error('Mandatory arguments are missing');
    }

    const res = await fetch('https://frame.syndicate.io/api/v2/sendTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        frameTrustedData,
        contractAddress,
        functionSignature,
        args: contractArgs,
        shouldLike,
        shouldRecast,
        shouldFollow,
      }),
    });

    const json = (await res.json()) as SendFrameApiTransactionFetchResponse;

    if (isFailedFrameApiResponse(json)) {
      throw new Error(json.error);
    }

    return json.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Syndicate Frame API error - Send Transaction: ${error.message}`);
    }
    console.error('Syndicate Frame API error - Send Transaction: Unknown error occurred');

    return undefined;
  }
}
