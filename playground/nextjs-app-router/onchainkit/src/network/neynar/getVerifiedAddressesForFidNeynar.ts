import { getDataFromNeynar } from './getDataFromNeynar';
import { NEYNAR_DEFAULT_API_KEY } from './neynarFrameValidation';

export async function getVerifiedAddressesForFidNeynar(
  fid: number,
  apiKey: string = NEYNAR_DEFAULT_API_KEY,
): Promise<string[]> {
  const url = `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  if (!responseBody?.users?.[0]?.verifications?.length) {
    throw new Error(`No verified addresses found for FID ${fid}`);
  }
  return responseBody.users[0].verifications;
}
