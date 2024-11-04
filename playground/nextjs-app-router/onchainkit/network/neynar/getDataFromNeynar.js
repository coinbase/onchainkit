import { version } from '../../version.js';
import { FetchError } from './FetchError.js';
import { NEYNAR_DEFAULT_API_KEY } from './neynarFrameValidation.js';
async function getDataFromNeynar(url, apiKey = NEYNAR_DEFAULT_API_KEY) {
  const options = {
    method: 'GET',
    url: url,
    headers: {
      accept: 'application/json',
      api_key: apiKey,
      'content-type': 'application/json',
      onchainkit_version: version
    }
  };
  const resp = await fetch(options.url, options);
  if (resp.status !== 200) {
    throw new FetchError(`non-200 status returned from neynar : ${resp.status}`);
  }
  return await resp.json();
}
export { getDataFromNeynar };
//# sourceMappingURL=getDataFromNeynar.js.map
