import { FrameValidationResponse } from './farcasterTypes';
import { neynarFrameValidation } from '../utils/neynar/frame/neynarFrameFunctions';

/**
 * Given a frame message, decode and validate it.
 *
 * If message is valid, return the message. Otherwise undefined.
 *
 * @param body The JSON received by server on frame callback
 */
async function getFrameMessage(body: any): Promise<FrameValidationResponse> {
  // Validate the message
  const response = await neynarFrameValidation(body?.trustedData?.messageBytes);
  if (response?.valid) {
    return {
      isValid: true,
      message: response,
    };
  } else {
    // Security best practice, don't return anything if we can't validate the frame.
    return {
      isValid: false,
      message: undefined,
    };
  }
}

export { getFrameMessage };
