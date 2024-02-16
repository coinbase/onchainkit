import { validateFramesPost, XmtpOpenFramesRequest } from '@xmtp/frames-validator';

export async function validateXmtpFramesPost(payload: XmtpOpenFramesRequest) {
  if (!payload.clientProtocol || !payload.clientProtocol.startsWith('xmtp@')) {
    return {
      isValid: false as const,
      message: undefined,
    };
  }

  try {
    const { actionBody, verifiedWalletAddress } = await validateFramesPost(payload);
    return {
      isValid: true as const,
      message: {
        ...actionBody,
        verifiedWalletAddress,
        identifier: verifiedWalletAddress,
      },
    };
  } catch (e) {
    return {
      isValid: false as const,
      message: undefined,
    };
  }
}
