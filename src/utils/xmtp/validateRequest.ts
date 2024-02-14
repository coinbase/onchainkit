import { validateFramesPost, XmtpOpenFramesRequest } from '@xmtp/frames-validator';

export async function xmtpFrameValidation(payload: XmtpOpenFramesRequest) {
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
        verifiedWalletAddress,
      },
    };
  } catch (e) {
    console.error(`Error validating frames post: ${e}`);
    return {
      isValid: false,
      message: undefined,
    };
  }
}
