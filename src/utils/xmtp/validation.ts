import { FramePostPayload } from '@xmtp/frames-validator';
import { FrameValidationResponse } from '../../core/types';
import { validateFramesPost } from '@xmtp/frames-validator';

export function isXmtpFrameResponse(json: any): json is FramePostPayload {
  return (
    !!json?.untrustedData?.opaqueConversationIdentifier && !!json.trustedData?.messageBytes.length
  );
}

export async function validateXmtpFrameResponse(
  data: FramePostPayload,
): Promise<FrameValidationResponse> {
  try {
    const { verifiedWalletAddress, actionBody } = await validateFramesPost(data);
    return {
      isValid: true,
      message: {
        ...actionBody,
        verifiedWalletAddress,
      },
      clientType: 'xmtp',
    };
  } catch (e) {
    console.error(e);
    return { isValid: false, message: undefined };
  }
}
