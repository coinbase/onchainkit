import { getCustodyAddressForFidNeynar } from '../utils/neynar/user/getCustodyAddressForFidNeynar';
import { getVerifiedAddressesForFidNeynar } from '../utils/neynar/user/getVerifiedAddressesForFidNeynar';
import { FarcasterAddressType, GetFarcasterUserAddressRequest } from './types';

type GetUserAddressOptions =
  | {
      neynarApiKey?: string;
    }
  | undefined;

/**
 * Get the user address for a given fid
 * @param fid  The frame id
 * @param FarcasterAddressType represents whether the client wants a verified address or a custody address
 * @returns the validation addresse or the custory address. If there is an error, it returns null
 */
async function getFarcasterUserAddress(
  getFarcasterUserAddressRequest: GetFarcasterUserAddressRequest,
  options?: GetUserAddressOptions,
): Promise<string | null> {
  try {
    const { fid, farcasterAddressType } = getFarcasterUserAddressRequest;
    if (farcasterAddressType === FarcasterAddressType.VerifiedAddress) {
      const addresses = await getVerifiedAddressesForFidNeynar(fid, options?.neynarApiKey);
      return addresses[0];
    }
    const address = await getCustodyAddressForFidNeynar(fid, options?.neynarApiKey);
    return address;
  } catch (e) {
    return null;
  }
}

export { FarcasterAddressType, getFarcasterUserAddress };
