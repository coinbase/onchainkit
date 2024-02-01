import { FetchError } from '../exceptions/FetchError';
import { convertToNeynarResponseModel, NeynarFrameValidationResponse } from './neynarFrameModels';

export const NEYNAR_DEFAULT_API_KEY = 'NEYNAR_ONCHAIN_KIT';

export async function neynarFrameValidation(
  messageBytes: string,
  apiKey: string = NEYNAR_DEFAULT_API_KEY,
  castReactionContext = true,
  followContext = true,
): Promise<NeynarFrameValidationResponse | undefined> {
  const options = {
    method: 'POST',
    url: `https://api.neynar.com/v2/farcaster/frame/validate`,
    headers: { accept: 'application/json', api_key: apiKey, 'content-type': 'application/json' },
    body: JSON.stringify({
      message_bytes_in_hex: messageBytes,
      cast_reaction_context: castReactionContext, // Returns if the user has liked/recasted
      follow_context: followContext, // Returns if the user is Following
    }),
  };
  const resp = await fetch(options.url, options);
  if (resp.status !== 200) {
    throw new FetchError(`non-200 status returned from neynar : ${resp.status}`);
  }
  const responseBody = await resp.json();
  return convertToNeynarResponseModel(responseBody);
}
