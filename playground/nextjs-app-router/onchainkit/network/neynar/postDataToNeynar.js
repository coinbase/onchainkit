import { version } from '../../version.js';
import { FetchError } from './FetchError.js';

/* biome-ignore lint: code needs to be deprecated */
async function postDataToNeynar(url, apiKey, data) {
  const options = {
    method: 'POST',
    url: url,
    headers: {
      accept: 'application/json',
      api_key: apiKey,
      'content-type': 'application/json',
      onchainkit_version: version
    },
    body: JSON.stringify(data)
  };
  const resp = await fetch(options.url, options);
  if (resp.status !== 200) {
    throw new FetchError(`non-200 status returned from neynar : ${resp.status}`);
  }
  return await resp.json();
}
export { postDataToNeynar };
//# sourceMappingURL=postDataToNeynar.js.map
