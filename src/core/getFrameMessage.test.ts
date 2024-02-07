import { mockNeynarResponse } from './mock';
import { getFrameMessage } from './getFrameMessage';
import { neynarBulkUserLookup } from '../utils/neynar/user/neynarUserFunctions';
import { FrameRequest } from './types';
import { neynarFrameValidation } from '../utils/neynar/frame/neynarFrameFunctions';
import { validateXmtpFrameResponse } from '../utils/xmtp/validation';

jest.mock('../utils/neynar/user/neynarUserFunctions', () => {
  return {
    neynarBulkUserLookup: jest.fn(),
  };
});

jest.mock('../utils/neynar/frame/neynarFrameFunctions', () => {
  return {
    isXmtpFrameResponse: jest.requireActual('../utils/xmtp/validation').isXmtpFrameResponse,
    neynarFrameValidation: jest.fn(),
  };
});

jest.mock('../utils/xmtp/validation', () => ({
  validateXmtpFrameResponse: jest.fn(),
}));

describe('getFrameValidatedMessage', () => {
  it('should return undefined if the message is invalid', async () => {
    const result = await getFrameMessage({
      trustedData: { messageBytes: 'invalid' },
    } as FrameRequest);
    expect(result?.isValid).toEqual(false);
  });

  it('should return the message if the message is valid', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    mockNeynarResponse(
      fid,
      addresses,
      neynarBulkUserLookup as jest.Mock,
      neynarFrameValidation as jest.Mock,
    );
    const fakeFrameData = {
      trustedData: {},
    };
    const result = await getFrameMessage(fakeFrameData as FrameRequest);
    if ('clientType' in result && result.clientType === 'farcaster') {
      expect(result?.message.interactor.fid).toEqual(fid);
    } else {
      fail("Expected clientType to be 'farcaster' but it wasn't");
    }
  });
});

describe('getFrameValidatedMessageXmtp', () => {
  afterEach(() => {
    (validateXmtpFrameResponse as jest.Mock).mockReset();
  });

  it('should return a valid response if opaqueConversationIdentifier is present', async () => {
    const payload = {
      untrustedData: {
        opaqueConversationIdentifier: 'opaqueConversationIdentifier',
      },
      trustedData: {
        messageBytes: 'messageBytes',
      },
    };
    (validateXmtpFrameResponse as jest.Mock).mockResolvedValue({
      clientType: 'xmtp',
      isValid: true,
      message: {
        verifiedWalletAddress: 'verifiedWalletAddress',
        buttonIndex: 1,
        frameUrl: 'http://frames.com/foo',
        opaqueConversationIdentifier: 'opaqueConversationIdentifier',
      },
    });

    const result = await getFrameMessage(payload as FrameRequest);
    expect(result.isValid).toEqual(true);
    if (!result.message || result.clientType !== 'xmtp') {
      throw new Error('Invalid response type');
    }
    expect(result.message.buttonIndex).toEqual(1);
    expect(result.message.frameUrl).toEqual('http://frames.com/foo');
    expect(result.message.opaqueConversationIdentifier).toEqual('opaqueConversationIdentifier');
    expect(result.message.verifiedWalletAddress).toEqual('verifiedWalletAddress');
  });
});
