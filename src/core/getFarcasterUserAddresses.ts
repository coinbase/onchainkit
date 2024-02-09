import { neynarGetCustodyAddressesForFid } from '../utils/neynar/frame/neynarGetCustodyAddressForFid';
import { neynarGetVerifiedAddressesForFid } from '../utils/neynar/frame/neynarGetVerifiedAddressesForFid';
import { FarcasterAddressType, GetFarcasterUserAddressesRequest } from './types';

type GetUserAddressOptions =
  | {
      neynarApiKey?: string;
    }
  | undefined;

/**
 * Get the user address for a given fid
 * @param fid  The frame id
 * @param FarcasterAddressType represents whether the client wants a verified address or a custody address
 * @returns the validation addresses or the custory address. If there is an error, it throws an error
 */

async function getFarcasterUserAddresses(
  getFarcasterUserAddressRequest: GetFarcasterUserAddressesRequest,
  options?: GetUserAddressOptions,
) {
  try {
    const { fid, farcasterAddressType } = getFarcasterUserAddressRequest;
    if (farcasterAddressType === FarcasterAddressType.VerifiedAddresses) {
      const addresses = await neynarGetVerifiedAddressesForFid(fid, options?.neynarApiKey);
      return addresses;
    }
    const address = await neynarGetCustodyAddressesForFid(fid, options?.neynarApiKey);
    return address;
  } catch (e) {
    throw e;
  }
}

export { FarcasterAddressType, getFarcasterUserAddresses };
