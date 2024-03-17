import { version } from '../../version';
import { FetchError } from './exceptions/FetchError';

export async function postDataToNeynar(url: string, apiKey: string, data: any) {
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
