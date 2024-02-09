import { neynarGetCustodyAddressesForFid } from '../utils/neynar/frame/neynarGetCustodyAddressForFid';
import { neynarGetVerifiedAddressesForFid } from '../utils/neynar/frame/neynarGetVerifiedAddressesForFid';
import { FrameAddressType, GetUserAddressRequest } from './types';

type GetUserAddressOptions =
  | {
      neynarApiKey?: string;
    }
  | undefined;

/**
 * Get the user address for a given fid
 * @param fid  The frame id
 * @param frameAddressType represents whether the client wants a verified address or a custody address
 * @returns the address or throws an error
 */

async function getUserAddress(
  getUserAddressRequest: GetUserAddressRequest,
  options?: GetUserAddressOptions,
) {
  try {
    const { fid, frameAddressType } = getUserAddressRequest;
    if (frameAddressType === FrameAddressType.VerifiedAddress) {
      const addresses = await neynarGetVerifiedAddressesForFid(fid, options?.neynarApiKey);
      return addresses[0];
    }

    const address = await neynarGetCustodyAddressesForFid(fid, options?.neynarApiKey);
    return address;
  } catch (e) {
    throw e;
  }
}

export { getUserAddress, FrameAddressType };
