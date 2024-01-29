import { mockNeynarResponse } from './mock';
import { getFrameValidatedMessage } from './getFrameValidatedMessage';

const bulkUserLookupMock = jest.fn();
jest.mock('../internal/neynar/neynarClient', () => {
  return {
    NeynarClient: jest.fn().mockImplementation(() => {
      return {
        user: {
          bulkUserLookup: bulkUserLookupMock,
          // other user functions can be mocked here
        },
        // other properties and methods of NeynarClient can be mocked here
      };
    }),
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
    const { validateMock } = mockNeynarResponse(fid, addresses, bulkUserLookupMock);
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
    mockNeynarResponse(fid, addresses, bulkUserLookupMock);
    const fakeFrameData = {
      trustedData: {},
    };
    const result = await getFrameValidatedMessage(fakeFrameData);
    expect(result).toEqual({ data: { fid } });
  });
});
