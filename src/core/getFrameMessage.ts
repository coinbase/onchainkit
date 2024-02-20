import { FrameRequest, FrameValidationResponse, MockFrameRequest } from './types';
import {
  NEYNAR_DEFAULT_API_KEY,
  neynarFrameValidation,
} from '../utils/neynar/frame/neynarFrameFunctions';

type FrameMessageOptions =
  | {
      neynarApiKey?: string;
      castReactionContext?: boolean;
      followContext?: boolean;
      allowDebug?: boolean;
    }
  | undefined;

/**
 * Given a frame message, decode and validate it.
 *
 * If message is valid, return the message. Otherwise undefined.
 *
 * @param body The JSON received by server on frame callback
 */
async function getFrameMessage(
  body: FrameRequest | MockFrameRequest,
  messageOptions?: FrameMessageOptions,
): Promise<FrameValidationResponse> {
  // Skip validation only when allowed and when receiving a debug request
  if (messageOptions?.allowDebug) {
    if ((body as MockFrameRequest).onchainkitDebug) {
      return {
        isValid: true,
        message: (body as MockFrameRequest).onchainkitDebug,
      };
    }
  }

  // Validate the message
  const response = await neynarFrameValidation(
    body?.trustedData?.messageBytes,
    messageOptions?.neynarApiKey || NEYNAR_DEFAULT_API_KEY,
    messageOptions?.castReactionContext || true,
    messageOptions?.followContext || true,
  );
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
