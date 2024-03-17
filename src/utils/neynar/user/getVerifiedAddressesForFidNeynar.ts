import { NEYNAR_DEFAULT_API_KEY } from '../frame/neynarFrameValidation';
import { getDataFromNeynar } from '../getDataFromNeynar';

export async function getVerifiedAddressesForFidNeynar(
  fid: number,
  apiKey: string = NEYNAR_DEFAULT_API_KEY,
): Promise<string[]> {
  const url = `https://api.neynar.com/v1/farcaster/verifications?fid=${fid}`;
  const responseBody = await getDataFromNeynar(url, apiKey);
  if (
    !responseBody ||
    !responseBody.result ||
    !responseBody.result.verifications ||
    responseBody.result.verifications.length === 0
  ) {
    throw new Error('No verified addresses found for FID ' + fid);
  }
  return responseBody.result.verifications;
}
