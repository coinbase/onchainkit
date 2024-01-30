import { getFrameAccountAddress } from './getFrameAccountAddress';
import { mockNeynarResponse } from './mock';
import { neynarBulkUserLookup } from '../utils/neynar/user/neynarUserFunctions';
import { FrameData } from './farcasterTypes';

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
  const fakeMessage = {
    fid: 1234,
  };
  const fakeApiKey = {
    NEYNAR_API_KEY: '1234',
  };

  it('should return the first verification for valid input', async () => {
    const addresses = ['0xaddr1'];
    mockNeynarResponse(fakeMessage.fid, addresses, neynarBulkUserLookup as jest.Mock);

    const response = await getFrameAccountAddress(fakeMessage as FrameData, fakeApiKey);
    expect(response).toEqual(addresses[0]);
  });

  it('should return undefined for invalid input', async () => {
    mockNeynarResponse(fakeMessage.fid, undefined, neynarBulkUserLookup as jest.Mock);

    const response = await getFrameAccountAddress(fakeMessage as FrameData, fakeApiKey);
    expect(response).toBeUndefined();
  });
});
