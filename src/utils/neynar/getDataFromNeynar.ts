import { version } from '../../version';
import { FetchError } from './exceptions/FetchError';
import { NEYNAR_DEFAULT_API_KEY } from './frame/neynarFrameValidation';

export async function getDataFromNeynar(url: string, apiKey: string = NEYNAR_DEFAULT_API_KEY) {
  const options = {
    method: 'GET',
    url: url,
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
  return await resp.json();
}
