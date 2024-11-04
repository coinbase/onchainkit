import { getDataFromNeynar } from './getDataFromNeynar.js';
import { NEYNAR_DEFAULT_API_KEY } from './neynarFrameValidation.js';
async function getCustodyAddressForFidNeynar(fid, apiKey = NEYNAR_DEFAULT_API_KEY) {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  if (!responseBody?.users?.[0]?.custody_address) {
    throw new Error(`No custody address found for FID ${fid}`);
  }
  return responseBody.users[0].custody_address;
}
export { getCustodyAddressForFidNeynar };
//# sourceMappingURL=getCustodyAddressForFidNeynar.js.map
