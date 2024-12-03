import { validateFramesPost } from '@xmtp/frames-validator';
import type { XmtpOpenFramesRequest } from '@xmtp/frames-validator';

type FrameActionBody = Awaited<
  ReturnType<typeof validateFramesPost>
>['actionBody'];

type XmtpFrameMessage =
  | {
      isValid: false;
      message: undefined;
    }
  | {
      isValid: true;
      message: Omit<FrameActionBody, 'timestamp'> & {
        timestamp: number;
        verifiedWalletAddress: string;
        identifier: string;
      };
    };

export async function getXmtpFrameMessage(
  payload: XmtpOpenFramesRequest
): Promise<XmtpFrameMessage> {
  if (!payload.clientProtocol || !payload.clientProtocol.startsWith('xmtp@')) {
    return {
      isValid: false,
      message: undefined,
    };
  }
  try {
    const { actionBody, verifiedWalletAddress } = await validateFramesPost(
      payload
    );
    return {
      isValid: true,
      message: {
        ...actionBody,
        timestamp: actionBody.timestamp.toNumber(),
        verifiedWalletAddress,
        identifier: verifiedWalletAddress,
      },
    };
  } catch (_e) {
    return {
      isValid: false,
      message: undefined,
    };
  }
}
