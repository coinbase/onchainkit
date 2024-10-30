var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/xmtp/getXmtpFrameMessage.ts
import { validateFramesPost } from "@xmtp/frames-validator";
async function getXmtpFrameMessage(payload) {
  if (!payload.clientProtocol || !payload.clientProtocol.startsWith("xmtp@")) {
    return {
      isValid: false,
      message: void 0
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
        identifier: verifiedWalletAddress
      }
    };
  } catch (_e) {
    return {
      isValid: false,
      message: void 0
    };
  }
}
__name(getXmtpFrameMessage, "getXmtpFrameMessage");

// src/xmtp/isXmtpFrameRequest.ts
function isXmtpFrameRequest(payload) {
  return !!payload && !!payload.untrustedData && !!payload.trustedData && !!payload.clientProtocol?.startsWith("xmtp@");
}
__name(isXmtpFrameRequest, "isXmtpFrameRequest");
export {
  getXmtpFrameMessage,
  isXmtpFrameRequest
};
//# sourceMappingURL=index.js.map