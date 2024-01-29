import { getFrameAccountAddress } from './getFrameAccountAddress';
import { mockNeynarResponse } from './mock';
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
    mockNeynarResponse(fid, addresses, neynarBulkUserLookup as jest.Mock);

    const response = await getFrameAccountAddress(fakeFrameData as FrameRequest, fakeApiKey);
    expect(response).toEqual(addresses[0]);
  });

  it('when the call from farcaster fails we should return undefined', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    const { validateMock } = mockNeynarResponse(fid, addresses, neynarBulkUserLookup as jest.Mock);
    validateMock.mockClear();
    validateMock.mockResolvedValue({
      isOk: () => {
        return false;
      },
    });
    const response = await getFrameAccountAddress(fakeFrameData as FrameRequest, fakeApiKey);
    expect(response).toEqual(undefined);
  });
});
