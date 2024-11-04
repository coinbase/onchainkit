import { convertToNeynarResponseModel } from './convertToNeynarResponseModel.js';
import { postDataToNeynar } from './postDataToNeynar.js';
const NEYNAR_DEFAULT_API_KEY = 'NEYNAR_ONCHAIN_KIT';
async function neynarFrameValidation(messageBytes, apiKey = NEYNAR_DEFAULT_API_KEY, castReactionContext = true, followContext = true) {
  const url = 'https://api.neynar.com/v2/farcaster/frame/validate';
  const responseBody = await postDataToNeynar(url, apiKey, {
    message_bytes_in_hex: messageBytes,
    cast_reaction_context: castReactionContext,
    // Returns if the user has liked/recasted
    follow_context: followContext // Returns if the user is Following
  });
  return convertToNeynarResponseModel(responseBody);
}
export { NEYNAR_DEFAULT_API_KEY, neynarFrameValidation };
//# sourceMappingURL=neynarFrameValidation.js.map
