import { getFrameAccountAddress } from './getFrameAccountAddress';
import { mockNeynarResponse } from './mock';

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

describe('getFrameAccountAddress', () => {
  const fakeFrameData = {
    trustedData: {},
  };
  const fakeApiKey = {
    NEYNAR_API_KEY: '1234',
  };

  it('should return the first verification for valid input', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    mockNeynarResponse(fid, addresses, bulkUserLookupMock);

    const response = await getFrameAccountAddress(fakeFrameData, fakeApiKey);
    expect(response).toEqual(addresses[0]);
  });

  it('when the call from farcaster fails we should return undefined', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    const { validateMock } = mockNeynarResponse(fid, addresses, bulkUserLookupMock);
    validateMock.mockClear();
    validateMock.mockResolvedValue({
      isOk: () => {
        return false;
      },
    });
    const response = await getFrameAccountAddress(fakeFrameData, fakeApiKey);
    expect(response).toEqual(undefined);
  });
});
