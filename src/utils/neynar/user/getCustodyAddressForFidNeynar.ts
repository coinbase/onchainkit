import { getDataFromNeynar } from '../getDataFromNeynar';
import { NEYNAR_DEFAULT_API_KEY } from '../frame/neynarFrameValidation';

export async function getCustodyAddressForFidNeynar(
  fid: number,
  apiKey: string = NEYNAR_DEFAULT_API_KEY,
): Promise<string> {
  const url = `https://api.neynar.com/v1/farcaster/custody-address?fid=${fid}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  if (!responseBody || !responseBody.result || !responseBody.result.custodyAddress) {
    throw new Error('No custody address found for FID ' + fid);
  }
  return responseBody.result.custodyAddress;
}
