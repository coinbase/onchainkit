import { XmtpOpenFramesRequest } from '@xmtp/frames-validator';
import { getXmtpFrameMessage } from './getXmtpFrameMessage';

describe('getXmtpFrameMessage', () => {
  const VALID_FRAME_MESSAGE = {
    clientProtocol: 'xmtp@2024-02-09',
    untrustedData: {
      buttonIndex: 1,
      opaqueConversationIdentifier: '8Yo5DAFCnhCA0DYjsnqMr5L2iRaXLyhUe+gSGDiEvVw=',
      walletAddress: '0x3AB6F6426210b5F52B780a0508ff6543d80cF317',
      url: 'https://fc-polls-five.vercel.app/polls/01032f47-e976-42ee-9e3d-3aac1324f4b8',
      timestamp: 1708107878809,
      unixTimestamp: 1708107878809,
    },
    trustedData: {
      messageBytes:
        'CkQKQgpAsecClMzkylY10ZxuNAa1QpwGJ2ilL99DEhnEkw1TUP06PhdbPERyfnhV/Edaxf785f5X5xtU5njJbECW8LH1jBKwAgqUAQpMCK2Wp5nbMRpDCkEERqraouBXv1AuTA7CI248VIFQnUwD4/U3aYObQkzJKWip8GK/jIIBih4/U0EaMLqT4IwsfXQqSqMMW97GhALV3BJEEkIKQFzWJg8ivoz96M2zxZMyqS2dlacbYyIr5CJbpNHded56T4BlHxIIT7ONYOfIxUhGIB5QHjmRO7ONZH98YddqZHkSlgEKTAivlqeZ2zEaQwpBBB9ZXGPtR76HcdNPQOLZJgQVLNzJobjnKxpoOUDfvO7gYRXEB7jXO2pI03t1/tNdx2vvNJPM1GMKvYeOB2NPFuISRgpECkCs8/ba8awuLdwhqTNYEmwEDf+IKEs4/GNcFATDmNvsjSDpBYnJHBCYzLsP+nq4AExzv/nT0ib8jAv/R/w2GvtHEAEahAEKS2h0dHBzOi8vZmMtcG9sbHMtZml2ZS52ZXJjZWwuYXBwL3BvbGxzLzAxMDMyZjQ3LWU5NzYtNDJlZS05ZTNkLTNhYWMxMzI0ZjRiOBABGJmjp5nbMSIsOFlvNURBRkNuaENBMERZanNucU1yNUwyaVJhWEx5aFVlK2dTR0RpRXZWdz0=',
    },
  } as XmtpOpenFramesRequest;

  const INVALID_FRAME_MESSAGE = {
    clientProtocol: 'xmtp@2024-02-09',
    untrustedData: {
      buttonIndex: 1,
      opaqueConversationIdentifier: '8Yo5DAFCnhCA0DYjsnqMr5L2iRaXLyhUe+gSGDiEvVw=',
      walletAddress: 'foo',
      url: 'https://fc-polls-five.vercel.app/polls/01032f47-e976-42ee-9e3d-3aac1324f4b8',
      timestamp: 1708107878809,
      unixTimestamp: 1708107878809,
    },
    trustedData: {
      messageBytes:
        'CkQKQgpAsecClMzkylY10ZxuNAa1QpwGJ2ilL99DEhnEkw1TUP06PhdbPERyfnhV/Edaxf785f5X5xtU5njJbECW8LH1jBKwAgqUAQpMCK2Wp5nbMRpDCkEERqraouBXv1AuTA7CI248VIFQnUwD4/U3aYObQkzJKWip8GK/jIIBih4/U0EaMLqT4IwsfXQqSqMMW97GhALV3BJEEkIKQFzWJg8ivoz96M2zxZMyqS2dlacbYyIr5CJbpNHded56T4BlHxIIT7ONYOfIxUhGIB5QHjmRO7ONZH98YddqZHkSlgEKTAivlqeZ2zEaQwpBBB9ZXGPtR76HcdNPQOLZJgQVLNzJobjnKxpoOUDfvO7gYRXEB7jXO2pI03t1/tNdx2vvNJPM1GMKvYeOB2NPFuISRgpECkCs8/ba8awuLdwhqTNYEmwEDf+IKEs4/GNcFATDmNvsjSDpBYnJHBCYzLsP+nq4AExzv/nT0ib8jAv/R/w2GvtHEAEahAEKS2h0dHBzOi8vZmMtcG9sbHMtZml2ZS52ZXJjZWwuYXBwL3BvbGxzLzAxMDMyZjQ3LWU5NzYtNDJlZS05ZTNkLTNhYWMxMzI0ZjRiOBABGJmjp5nbMSIsOFlvNURBRkNuaENBMERZanNucU1yNUwyaVJhWEx5aFVlK2dTR0RpRXZWdz0=',
    },
  } as XmtpOpenFramesRequest;

  it('should correctly handle valid frames posts', async () => {
    const result = await getXmtpFrameMessage(VALID_FRAME_MESSAGE);
    expect(result.isValid).toBe(true);

    const { buttonIndex, opaqueConversationIdentifier, url, walletAddress } =
      VALID_FRAME_MESSAGE.untrustedData;

    expect(result.message).toEqual(
      expect.objectContaining({
        verifiedWalletAddress: walletAddress,
        identifier: walletAddress,
        frameUrl: url,
        buttonIndex,
        opaqueConversationIdentifier,
      }),
    );
  });

  it('should fail validation on invalid posts', async () => {
    const invalidResult = await getXmtpFrameMessage(INVALID_FRAME_MESSAGE);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.message).toBeUndefined();
  });

  it('should fail validation on missing clientProtocol', async () => {
    const invalidResult = await getXmtpFrameMessage({
      untrustedData: {
        buttonIndex: 1,
        opaqueConversationIdentifier: '8Yo5DAFCnhCA0DYjsnqMr5L2iRaXLyhUe+gSGDiEvVw=',
        walletAddress: 'foo',
        url: 'https://fc-polls-five.vercel.app/polls/01032f47-e976-42ee-9e3d-3aac1324f4b8',
        timestamp: 1708107878809,
        unixTimestamp: 1708107878809,
      },
      trustedData: {
        messageBytes:
          'CkQKQgpAsecClMzkylY10ZxuNAa1QpwGJ2ilL99DEhnEkw1TUP06PhdbPERyfnhV/Edaxf785f5X5xtU5njJbECW8LH1jBKwAgqUAQpMCK2Wp5nbMRpDCkEERqraouBXv1AuTA7CI248VIFQnUwD4/U3aYObQkzJKWip8GK/jIIBih4/U0EaMLqT4IwsfXQqSqMMW97GhALV3BJEEkIKQFzWJg8ivoz96M2zxZMyqS2dlacbYyIr5CJbpNHded56T4BlHxIIT7ONYOfIxUhGIB5QHjmRO7ONZH98YddqZHkSlgEKTAivlqeZ2zEaQwpBBB9ZXGPtR76HcdNPQOLZJgQVLNzJobjnKxpoOUDfvO7gYRXEB7jXO2pI03t1/tNdx2vvNJPM1GMKvYeOB2NPFuISRgpECkCs8/ba8awuLdwhqTNYEmwEDf+IKEs4/GNcFATDmNvsjSDpBYnJHBCYzLsP+nq4AExzv/nT0ib8jAv/R/w2GvtHEAEahAEKS2h0dHBzOi8vZmMtcG9sbHMtZml2ZS52ZXJjZWwuYXBwL3BvbGxzLzAxMDMyZjQ3LWU5NzYtNDJlZS05ZTNkLTNhYWMxMzI0ZjRiOBABGJmjp5nbMSIsOFlvNURBRkNuaENBMERZanNucU1yNUwyaVJhWEx5aFVlK2dTR0RpRXZWdz0=',
      },
    } as XmtpOpenFramesRequest);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.message).toBeUndefined();
  });

  it('should fail validation on invalid clientProtocol', async () => {
    const invalidResult = await getXmtpFrameMessage({
      clientProtocol: 'potato@2024-02-09',
      untrustedData: {
        buttonIndex: 1,
        opaqueConversationIdentifier: '8Yo5DAFCnhCA0DYjsnqMr5L2iRaXLyhUe+gSGDiEvVw=',
        walletAddress: 'foo',
        url: 'https://fc-polls-five.vercel.app/polls/01032f47-e976-42ee-9e3d-3aac1324f4b8',
        timestamp: 1708107878809,
        unixTimestamp: 1708107878809,
      },
      trustedData: {
        messageBytes:
          'CkQKQgpAsecClMzkylY10ZxuNAa1QpwGJ2ilL99DEhnEkw1TUP06PhdbPERyfnhV/Edaxf785f5X5xtU5njJbECW8LH1jBKwAgqUAQpMCK2Wp5nbMRpDCkEERqraouBXv1AuTA7CI248VIFQnUwD4/U3aYObQkzJKWip8GK/jIIBih4/U0EaMLqT4IwsfXQqSqMMW97GhALV3BJEEkIKQFzWJg8ivoz96M2zxZMyqS2dlacbYyIr5CJbpNHded56T4BlHxIIT7ONYOfIxUhGIB5QHjmRO7ONZH98YddqZHkSlgEKTAivlqeZ2zEaQwpBBB9ZXGPtR76HcdNPQOLZJgQVLNzJobjnKxpoOUDfvO7gYRXEB7jXO2pI03t1/tNdx2vvNJPM1GMKvYeOB2NPFuISRgpECkCs8/ba8awuLdwhqTNYEmwEDf+IKEs4/GNcFATDmNvsjSDpBYnJHBCYzLsP+nq4AExzv/nT0ib8jAv/R/w2GvtHEAEahAEKS2h0dHBzOi8vZmMtcG9sbHMtZml2ZS52ZXJjZWwuYXBwL3BvbGxzLzAxMDMyZjQ3LWU5NzYtNDJlZS05ZTNkLTNhYWMxMzI0ZjRiOBABGJmjp5nbMSIsOFlvNURBRkNuaENBMERZanNucU1yNUwyaVJhWEx5aFVlK2dTR0RpRXZWdz0=',
      },
    } as unknown as XmtpOpenFramesRequest);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.message).toBeUndefined();
  });
});
