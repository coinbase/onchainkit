import type { XmtpOpenFramesRequest } from '@xmtp/frames-validator';

export function isXmtpFrameRequest(
  /* biome-ignore lint: code needs to be refactored */
  payload: any,
): payload is XmtpOpenFramesRequest {
  return (
    !!payload &&
    !!payload.untrustedData &&
    !!payload.trustedData &&
    !!payload.clientProtocol?.startsWith('xmtp@')
  );
}
