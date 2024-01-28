import { mockNeynarResponse } from './mock';
import { getFrameValidatedMessage } from './getFrameValidatedMessage';

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
    const { validateMock } = mockNeynarResponse(fid, addresses);
    validateMock.mockClear();
    validateMock.mockResolvedValue({
      isOk: () => {
        return false;
      },
    });
    const result = await getFrameValidatedMessage({
      trustedData: { messageBytes: 'invalid' },
    });
    expect(result).toBeUndefined();
  });

  it('should return the message if the message is valid', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    mockNeynarResponse(fid, addresses);
    const fakeFrameData = {
      trustedData: {},
    };
    const result = await getFrameValidatedMessage(fakeFrameData);
    expect(result).toEqual({ data: { fid } });
  });
});
