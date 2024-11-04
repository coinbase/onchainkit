import { convertToNeynarUserResponseModel } from './convertToNeynarUserResponseModel.js';
import { getDataFromNeynar } from './getDataFromNeynar.js';
const NEYNAR_DEFAULT_API_KEY = 'NEYNAR_ONCHAIN_KIT';
async function neynarBulkUserLookup(farcasterIDs, apiKey = NEYNAR_DEFAULT_API_KEY) {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${farcasterIDs.join(',')}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  return convertToNeynarUserResponseModel(responseBody);
}
export { NEYNAR_DEFAULT_API_KEY, neynarBulkUserLookup };
//# sourceMappingURL=neynarBulkUserLookup.js.map
