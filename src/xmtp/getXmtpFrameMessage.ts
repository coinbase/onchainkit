import { validateFramesPost } from '@xmtp/frames-validator';
import type { XmtpOpenFramesRequest } from '@xmtp/frames-validator';

export async function getXmtpFrameMessage(payload: XmtpOpenFramesRequest) {
  if (!payload.clientProtocol || !payload.clientProtocol.startsWith('xmtp@')) {
    return {
      isValid: false,
      message: undefined,
    };
  }
  try {
    const { actionBody, verifiedWalletAddress } = await validateFramesPost(payload);
    return {
      isValid: true,
      message: {
        ...actionBody,
        timestamp: actionBody.timestamp.toNumber(),
        verifiedWalletAddress,
        identifier: verifiedWalletAddress,
      },
    };
  } catch (e) {
    return {
      isValid: false,
      message: undefined,
    };
  }
}
