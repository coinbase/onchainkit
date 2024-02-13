import { getCustodyAddressForFidNeynar } from '../utils/neynar/user/getCustodyAddressForFidNeynar';
import { getVerifiedAddressesForFidNeynar } from '../utils/neynar/user/getVerifiedAddressesForFidNeynar';
import { GetFarcasterUserAddressResponse } from './types';

type GetFarcasterUserAddressOptions =
  | {
      neynarApiKey?: string; // default to onchain-kit's default key
      hasCustodyAddress?: boolean; // default to true
      hasVerifiedAddresses?: boolean; // default to true
    }
  | undefined;

/**
 * Get the user address for a given fid
 * @param fid  The farcaster id
 * @param GetFarcasterUserAddressOptions  The options to specify the type of addresses to get and the neynar api key
 * @returns the custory address and/or verified addresses. If there is an error, it returns null
 */
async function getFarcasterUserAddress(
  fid: number,
  options?: GetFarcasterUserAddressOptions,
): Promise<GetFarcasterUserAddressResponse | null> {
  try {
    const hasCustodyAddress = options?.hasCustodyAddress ?? true;
    const hasVerifiedAddresses = options?.hasVerifiedAddresses ?? true;
    const response: GetFarcasterUserAddressResponse = {};

    if (hasCustodyAddress) {
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
