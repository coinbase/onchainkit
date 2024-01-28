import { HubRpcClient, Message, getSSLHubRpcClient } from '@farcaster/hub-nodejs';

// URL of the Hub
const HUB_URL = 'nemes.farcaster.xyz:2283';
// Create a Hub RPC client
const client: HubRpcClient = getSSLHubRpcClient(HUB_URL);

type FidResponse = {
  verifications: string[];
};

/**
 * Get the Account Address from the Farcaster ID using the Frame.
 * @param body
 * @param param1
 * @returns
 */
async function getFrameAccountAddress(
  body: { trustedData?: { messageBytes?: string } },
  { NEYNAR_API_KEY = 'NEYNAR_API_DOCS' },
) {
  let farcasterID = 0;
  let validatedMessage: Message | undefined = undefined;
  // Get the message from the request body
  const frameMessage: Message = Message.decode(
    Buffer.from(body?.trustedData?.messageBytes ?? '', 'hex'),
  );
  // Validate the message
  const result = await client.validateMessage(frameMessage);
  if (result.isOk() && result.value.valid && result.value.message) {
    validatedMessage = result.value.message;
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
  return '0x00';
}

export { getFrameAccountAddress };
