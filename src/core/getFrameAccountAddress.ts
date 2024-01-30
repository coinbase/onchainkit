import { getFrameMessage } from './getFrameMessage';
import { neynarBulkUserLookup } from '../utils/neynar/user/neynarUserFunctions';
import { FrameRequest } from './farcasterTypes';

type FidResponse = {
  verifications: string[];
};

type AccountAddressResponse = Promise<string | undefined>;

/**
 * Get the Account Address from the Farcaster ID using the Frame.
 * This uses a Neynar api to get verified addresses belonging
 * to the user wht that FID.
 *
 * This is using a demo api key so please register
 * on through https://neynar.com/.
 * @param body The JSON received by server on frame callback
 * @param NEYNAR_API_KEY The api key for the Neynar API
 * @returns The account address or undefined
 */
async function getFrameAccountAddress(
  body: FrameRequest,
  { NEYNAR_API_KEY = 'NEYNAR_API_DOCS' },
): AccountAddressResponse {
  const validatedMessage = await getFrameMessage(body);
  if (!validatedMessage?.isValid) {
    return;
  }
  // Get the Farcaster ID from the message
  const farcasterID = validatedMessage?.message?.fid ?? 0;
  // Get the user verifications from the Farcaster Indexer
  const bulkUserLookupResponse = await neynarBulkUserLookup([farcasterID], NEYNAR_API_KEY);
  if (bulkUserLookupResponse?.users) {
    const userVerifications = bulkUserLookupResponse?.users[0] as FidResponse;
    if (userVerifications.verifications) {
      return userVerifications.verifications[0];
    }
  }
  return;
}

export { getFrameAccountAddress };
