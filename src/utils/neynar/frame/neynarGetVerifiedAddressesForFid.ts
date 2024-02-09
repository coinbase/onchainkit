import { version } from '../../../version';
import { FetchError } from '../exceptions/FetchError';
import { NEYNAR_DEFAULT_API_KEY } from './neynarFrameFunctions';

export async function neynarGetVerifiedAddressesForFid(
  fid: number,
  apiKey: string = NEYNAR_DEFAULT_API_KEY,
): Promise<string[]> {
  const options = {
    method: 'GET',
    url: `https://api.neynar.com/v2/farcaster/verifiedAddress/${fid}`,
    headers: {
      accept: 'application/json',
      api_key: apiKey,
      'content-type': 'application/json',
      onchainkit_version: version,
    },
  };
  const resp = await fetch(options.url, options);
  if (resp.status !== 200) {
    throw new FetchError(`non-200 status returned from neynar : ${resp.status}`);
  }
  const responseBody = await resp.json();

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
