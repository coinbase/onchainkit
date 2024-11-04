import { getDataFromNeynar } from './getDataFromNeynar.js';
import { NEYNAR_DEFAULT_API_KEY } from './neynarFrameValidation.js';
async function getVerifiedAddressesForFidNeynar(fid, apiKey = NEYNAR_DEFAULT_API_KEY) {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  if (!responseBody?.users?.[0]?.verifications?.length) {
    throw new Error(`No verified addresses found for FID ${fid}`);
  }
  return responseBody.users[0].verifications;
}
export { getVerifiedAddressesForFidNeynar };
//# sourceMappingURL=getVerifiedAddressesForFidNeynar.js.map
