import { FrameValidationData } from '../../../frame/types';
import { convertToNeynarResponseModel } from './convertToNeynarResponseModel';
import { postDataToNeynar } from '../postDataToNeynar';

export const NEYNAR_DEFAULT_API_KEY = 'NEYNAR_ONCHAIN_KIT';

export async function neynarFrameValidation(
  messageBytes: string,
  apiKey: string = NEYNAR_DEFAULT_API_KEY,
  castReactionContext = true,
  followContext = true,
): Promise<FrameValidationData | undefined> {
  const url = `https://api.neynar.com/v2/farcaster/frame/validate`;

  const responseBody = await postDataToNeynar(url, apiKey, {
    message_bytes_in_hex: messageBytes,
    cast_reaction_context: castReactionContext, // Returns if the user has liked/recasted
    follow_context: followContext, // Returns if the user is Following
  });
  return convertToNeynarResponseModel(responseBody);
}
