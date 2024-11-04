import type { FrameRequest, FrameValidationResponse, MockFrameRequest } from '../types';
type FrameMessageOptions = {
    neynarApiKey?: string;
    castReactionContext?: boolean;
    followContext?: boolean;
    allowFramegear?: boolean;
} | undefined;
/**
 * Given a frame message, decode and validate it.
 * If message is valid, return the message. Otherwise undefined.
 */
declare function getFrameMessage(body: FrameRequest | MockFrameRequest, messageOptions?: FrameMessageOptions): Promise<FrameValidationResponse>;
export { getFrameMessage };
//# sourceMappingURL=getFrameMessage.d.ts.map