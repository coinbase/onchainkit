import { OpenFramesRequest, RequestValidator, ValidationResponse } from '@open-frames/types';
import { FarcasterOpenFramesRequest, FrameRequest, FrameValidationData } from '../../../core/types';
import { NEYNAR_DEFAULT_API_KEY, neynarFrameValidation } from '../frame/neynarFrameFunctions';
import { Options } from './types';

export class NeynarValidator
  implements RequestValidator<FarcasterOpenFramesRequest, FrameValidationData, 'farcaster'>
{
  readonly protocolIdentifier = 'farcaster';
  private options: Required<Options>;

  constructor(options?: Options) {
    this.options = {
      neynarApiKey: options?.neynarApiKey || NEYNAR_DEFAULT_API_KEY,
      castReactionContext: options?.castReactionContext || true,
      followContext: options?.followContext || true,
    };
  }

  minProtocolVersion(): string {
    return `${this.protocolIdentifier}@VNext`;
  }

  isSupported(payload: OpenFramesRequest): payload is FarcasterOpenFramesRequest {
    const isCorrectClientProtocol =
      !!payload.clientProtocol && payload.clientProtocol.startsWith('farcaster@');
    const isTrustedDataValid = typeof payload.trustedData?.messageBytes === 'string';

    return isCorrectClientProtocol && isTrustedDataValid;
  }

  async validate(
    payload: FarcasterOpenFramesRequest,
  ): Promise<ValidationResponse<FrameValidationData, typeof this.protocolIdentifier>> {
    const response = await neynarFrameValidation(
      payload.trustedData?.messageBytes,
      this.options.neynarApiKey,
      this.options.castReactionContext,
      this.options.followContext,
    );

    if (response?.valid) {
      return {
        isValid: true,
        clientProtocol: payload.clientProtocol,
        message: response,
      };
    }

    return {
      isValid: false,
    };
  }
}
