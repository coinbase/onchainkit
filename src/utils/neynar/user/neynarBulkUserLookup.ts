import { getDataFromNeynar } from '../getDataFromNeynar';
import { convertToNeynarResponseModel } from './convertToNeynarResponseModel';
import { NeynarBulkUserLookupModel } from './types';

export const NEYNAR_DEFAULT_API_KEY = 'NEYNAR_ONCHAIN_KIT';

export async function neynarBulkUserLookup(
  farcasterIDs: number[],
  apiKey: string = NEYNAR_DEFAULT_API_KEY,
): Promise<NeynarBulkUserLookupModel | undefined> {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${farcasterIDs.join(',')}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  return convertToNeynarResponseModel(responseBody);
}
