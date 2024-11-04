import type { XmtpOpenFramesRequest } from '@xmtp/frames-validator';
export declare function getXmtpFrameMessage(payload: XmtpOpenFramesRequest): Promise<{
    isValid: boolean;
    message: undefined;
} | {
    isValid: boolean;
    message: {
        timestamp: number;
        verifiedWalletAddress: string;
        identifier: string;
        frameUrl: string;
        buttonIndex: number;
        opaqueConversationIdentifier: string;
        unixTimestamp: number;
        inputText: string;
        state: string;
        address: string;
        transactionId: string;
    };
}>;
//# sourceMappingURL=getXmtpFrameMessage.d.ts.map