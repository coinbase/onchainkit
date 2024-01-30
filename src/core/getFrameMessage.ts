import { HubRpcClient, Message, getSSLHubRpcClient } from '@farcaster/hub-nodejs';
import { convertToFrame, FrameRequest, FrameValidationResponse } from './farcasterTypes';

/**
 * Farcaster Hub for signature verification,
 * consider using a private hub if needed:
 * https://docs.farcaster.xyz/hubble/hubble
 */
const HUB_URL = 'nemes.farcaster.xyz:2283';

export function getHubClient(): HubRpcClient {
  return getSSLHubRpcClient(HUB_URL);
}

/**
 * Given a frame message, decode and validate it.
 *
 * If message is valid, return the message. Otherwise undefined.
 *
 * @param body The JSON received by server on frame callback
 */
async function getFrameMessage(body: FrameRequest): Promise<FrameValidationResponse> {
  // Get the message from the request body
  const frameMessage: Message = Message.decode(
    Buffer.from(body?.trustedData?.messageBytes ?? '', 'hex'),
  );
  // Validate the message
  const client = getHubClient();
  const result = await client.validateMessage(frameMessage);
  if (result.isOk() && result.value.valid && result.value.message) {
    return {
      isValid: result.value?.valid,
      message: convertToFrame(result?.value?.message?.data),
    };
  }
  return {
    isValid: false,
    message: undefined,
  };
}

export { getFrameMessage };
