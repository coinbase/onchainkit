import { FrameRequest, FrameValidationResponse } from './types';
import {
  NEYNAR_DEFAULT_API_KEY,
  neynarFrameValidation,
} from '../utils/neynar/frame/neynarFrameFunctions';
import type {
  GetValidationResponse,
  OpenFramesRequest,
  RequestValidator,
} from '@open-frames/types';
import { NeynarValidator } from '../utils/neynar/openframes/neynarValidator';

type FrameMessageOptions =
  | {
      neynarApiKey?: string;
      castReactionContext?: boolean;
      followContext?: boolean;
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
  body: FrameRequest,
  messageOptions?: FrameMessageOptions,
): Promise<FrameValidationResponse> {
  const neynarValidator = new NeynarValidator(messageOptions);
  // Validate the message
  const response = await getOpenFramesMessage({ clientProtocol: 'farcaster@VNext', ...body }, [
    neynarValidator,
  ]);
  if (response.isValid) {
    return response;
  } else {
    // Security best practice, don't return anything if we can't validate the frame.
    return {
      isValid: false,
      message: undefined,
    };
  }
}

async function getOpenFramesMessage<ClientProtocols extends Array<RequestValidator<any, any, any>>>(
  body: OpenFramesRequest,
  clientProtocols: ClientProtocols,
): Promise<GetValidationResponse<ClientProtocols[number]>> {
  for (const protocol of clientProtocols) {
    if (protocol.isSupported(body)) {
      const validationResponse = await protocol.validate(body as any);
      return validationResponse as GetValidationResponse<ClientProtocols[number]>;
    }
  }

  return {
    isValid: false,
  } as GetValidationResponse<ClientProtocols[number]>;
}

export { getFrameMessage, getOpenFramesMessage };
