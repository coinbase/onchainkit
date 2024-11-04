import { getCustodyAddressForFidNeynar } from '../network/neynar/getCustodyAddressForFidNeynar.js';
import { getVerifiedAddressesForFidNeynar } from '../network/neynar/getVerifiedAddressesForFidNeynar.js';

/**
 * Get the user address for a given fid
 */
async function getFarcasterUserAddress(fid, options) {
  try {
    const hasCustodyAddress = options?.hasCustodyAddress ?? true;
    const hasVerifiedAddresses = options?.hasVerifiedAddresses ?? true;
    const response = {};
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
  } catch (_e) {
    return null;
  }
}
export { getFarcasterUserAddress };
//# sourceMappingURL=getFarcasterUserAddress.js.map
