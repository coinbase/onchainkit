import { getCustodyAddressForFidNeynar } from '../utils/neynar/user/getCustodyAddressForFidNeynar';
import { getVerifiedAddressesForFidNeynar } from '../utils/neynar/user/getVerifiedAddressesForFidNeynar';
import { GetFarcasterUserAddressResponse } from './types';

type GetFarcasterUserAddressOptions =
  | {
      neynarApiKey?: string; // default to onchain-kit's default key
      hasCustodyAddresses?: boolean; // default to true
      hasVerifiedAddresses?: boolean; // default to true
    }
  | undefined;

/**
 * Get the user address for a given fid
 * @param fid  The farcaster id
 * @param FarcasterAddressType represents whether the client wants a verified address or a custody address
 * @returns the validation addresses or the custory address. If there is an error, it returns null
 */
async function getFarcasterUserAddress(
  fid: number,
  options?: GetFarcasterUserAddressOptions,
): Promise<GetFarcasterUserAddressResponse | null> {
  try {
    const hasCustodyAddresses = options?.hasCustodyAddresses ?? true;
    const hasVerifiedAddresses = options?.hasVerifiedAddresses ?? true;
    const response: GetFarcasterUserAddressResponse = {};

    if (hasCustodyAddresses) {
      const custodyAddress = await getCustodyAddressForFidNeynar(fid, options?.neynarApiKey);
      if (custodyAddress) {
        response.custodyAddress = custodyAddress;
      }
    }

    if (hasVerifiedAddresses) {
      const verifiedAddresses = await getVerifiedAddressesForFidNeynar(fid, options?.neynarApiKey);
      if (verifiedAddresses) {
        response.verifiedAddresses = verifiedAddresses;
      }
    }

    return response;
  } catch (e) {
    return null;
  }
}

export { getFarcasterUserAddress };
