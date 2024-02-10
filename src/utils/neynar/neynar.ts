import { version } from '../../version';
import { FetchError } from './exceptions/FetchError';
import { NEYNAR_DEFAULT_API_KEY } from './frame/neynarFrameFunctions';

export async function fetchDataFromNeynar(url: string, apiKey: string = NEYNAR_DEFAULT_API_KEY) {
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

export async function postDataToNeynar(
  url: string,
  apiKey: string = NEYNAR_DEFAULT_API_KEY,
  data: any,
) {
  const options = {
    method: 'POST',
    url: url,
    headers: {
      accept: 'application/json',
      api_key: apiKey,
      'content-type': 'application/json',
      onchainkit_version: version,
    },
    body: JSON.stringify(data),
  };
  const resp = await fetch(options.url, options);
  if (resp.status !== 200) {
    throw new FetchError(`non-200 status returned from neynar : ${resp.status}`);
  }
  return await resp.json();
}
