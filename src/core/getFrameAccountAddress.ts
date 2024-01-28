import { HubRpcClient, Message, getSSLHubRpcClient } from '@farcaster/hub-nodejs';

/**
 * Farcaster Hub for signature verification, consider using a private hub if needed:
 * https://docs.farcaster.xyz/hubble/hubble
 */
const HUB_URL = 'nemes.farcaster.xyz:2283';

type FidResponse = {
  verifications: string[];
};

function getHubClient(): HubRpcClient {
  return getSSLHubRpcClient(HUB_URL);
}
/**
 * Get the Account Address from the Farcaster ID using the Frame.  This uses a Neynar api
 * to get verified addresses belonging to the user wht that FID.  This is using a demo api
 * key so please register on through https://neynar.com/.
 * @param body
 * @param param1
 * @returns
 */
async function getFrameAccountAddress(
  body: { trustedData?: { messageBytes?: string } },
  { NEYNAR_API_KEY = 'NEYNAR_API_DOCS' },
): Promise<string | undefined> {
  let farcasterID = 0;
  let validatedMessage: Message | undefined = undefined;
  // Get the message from the request body
  const frameMessage: Message = Message.decode(
    Buffer.from(body?.trustedData?.messageBytes ?? '', 'hex'),
  );
  // Validate the message
  const client = getHubClient();
  const result = await client.validateMessage(frameMessage);
  if (result.isOk() && result.value.valid && result.value.message) {
    validatedMessage = result.value.message;
  } else {
    return;
  }
  // Get the Farcaster ID from the message
  farcasterID = validatedMessage?.data?.fid ?? 0;
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
