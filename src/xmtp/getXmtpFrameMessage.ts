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

type XmtpEnv = Parameters<typeof validateFramesPost>[1];

export async function getXmtpFrameMessage(
  payload: XmtpOpenFramesRequest,
  env?: XmtpEnv
): Promise<XmtpFrameMessage> {
  if (!payload.clientProtocol || !payload.clientProtocol.startsWith('xmtp@')) {
    return {
      isValid: false,
      message: undefined,
    };
  }
  try {
    const { actionBody, verifiedWalletAddress } = await validateFramesPost(
      payload,
      env
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
