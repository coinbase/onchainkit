import { mockNeynarResponse } from './mock';
import { getFrameMessage } from './getFrameMessage';
import { neynarBulkUserLookup } from '../utils/neynar/user/neynarUserFunctions';
import { FrameRequest } from './farcasterTypes';

jest.mock('../utils/neynar/user/neynarUserFunctions', () => {
  return {
    neynarBulkUserLookup: jest.fn(),
  };
});

jest.mock('@farcaster/hub-nodejs', () => {
  return {
    getSSLHubRpcClient: jest.fn().mockReturnValue({
      validateMessage: jest.fn(),
    }),
    Message: {
      decode: jest.fn(),
    },
  };
});

describe('getFrameValidatedMessage', () => {
  it('should return undefined if the message is invalid', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    const { validateMock } = mockNeynarResponse(fid, addresses, neynarBulkUserLookup as jest.Mock);
    validateMock.mockClear();
    validateMock.mockResolvedValue({
      isOk: () => {
        return false;
      },
    });
    const result = await getFrameMessage({
      trustedData: { messageBytes: 'invalid' },
    } as FrameRequest);
    expect(result?.isValid).toEqual(false);
  });

  it('should return the message if the message is valid', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    mockNeynarResponse(fid, addresses, neynarBulkUserLookup as jest.Mock);
    const fakeFrameData = {
      trustedData: {},
    };
    const result = await getFrameMessage(fakeFrameData as FrameRequest);
    expect(result?.message?.fid).toEqual(fid);
  });
});
