import { neynarBulkUserLookup } from '../utils/neynar/user/neynarUserFunctions';
import { FrameData } from './farcasterTypes';

type AccountAddressResponse = Promise<string | undefined>;

type FidResponse = {
  verifications: string[];
};

/**
 * Get the Account Address from the Farcaster ID using the Frame.
 * This uses a Neynar api to get verified addresses belonging
 * to the user wht that FID.
 *
 * This is using a demo api key so please register
 * on through https://neynar.com/.
 * @param message The validated message from the Frame
 * @param NEYNAR_API_KEY The api key for the Neynar API
 * @returns The account address or undefined
 */
async function getFrameAccountAddress(
  message: FrameData,
  { NEYNAR_API_KEY = 'NEYNAR_ONCHAIN_KIT' },
): AccountAddressResponse {
  // Get the Farcaster ID from the message
  const farcasterID = message.fid ?? 0;
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
