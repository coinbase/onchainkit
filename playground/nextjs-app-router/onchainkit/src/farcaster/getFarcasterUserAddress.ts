import { getCustodyAddressForFidNeynar } from '../network/neynar/getCustodyAddressForFidNeynar';
import { getVerifiedAddressesForFidNeynar } from '../network/neynar/getVerifiedAddressesForFidNeynar';
import type { GetFarcasterUserAddressResponse } from './types';

type GetFarcasterUserAddressOptions =
  | {
      neynarApiKey?: string; // default to onchain-kit's default key
      hasCustodyAddress?: boolean; // default to true
      hasVerifiedAddresses?: boolean; // default to true
    }
  | undefined;

/**
 * Get the user address for a given fid
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
      const custodyAddress = await getCustodyAddressForFidNeynar(
        fid,
        options?.neynarApiKey,
      );
      if (custodyAddress) {
        response.custodyAddress = custodyAddress;
      }
    }

    if (hasVerifiedAddresses) {
      const verifiedAddresses = await getVerifiedAddressesForFidNeynar(
        fid,
        options?.neynarApiKey,
      );
      if (verifiedAddresses) {
        response.verifiedAddresses = verifiedAddresses;
      }
    }

    return response;
  } catch (_e) {
    return null;
  }
}

export { getFarcasterUserAddress };
