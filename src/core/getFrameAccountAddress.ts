import { getFrameValidatedMessage } from './getFrameValidatedMessage';

type FidResponse = {
  verifications: string[];
};

/**
 * Get the Account Address from the Farcaster ID using the Frame.
 * This uses a Neynar api to get verified addresses belonging
 * to the user wht that FID.
 *
 * This is using a demo api key so please register
 * on through https://neynar.com/.
 * @param body
 * @param param1
 * @returns
 */
async function getFrameAccountAddress(
  body: { trustedData?: { messageBytes?: string } },
  { NEYNAR_API_KEY = 'NEYNAR_API_DOCS' },
): Promise<string | undefined> {
  const validatedMessage = await getFrameValidatedMessage(body);
  if (!validatedMessage) {
    return;
  }
  // Get the Farcaster ID from the message
  const farcasterID = validatedMessage?.data?.fid ?? 0;
  // Get the user verifications from the Farcaster Indexer
  const options = {
    method: 'GET',
    url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${farcasterID}`,
    headers: { accept: 'application/json', api_key: NEYNAR_API_KEY },
  };
  const resp = await fetch(options.url, { headers: options.headers });
  const responseBody = await resp.json();
  // Get the user verifications from the response
  if (responseBody.users) {
    const userVerifications = responseBody.users[0] as FidResponse;
    if (userVerifications.verifications) {
      return userVerifications.verifications[0];
    }
  }
  return;
}

export { getFrameAccountAddress };
