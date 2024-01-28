import { getFrameAccountAddress } from './getFrameAccountAddress';

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

function buildFarcasterResponse(fid: number) {
  return {
    isOk: () => {
      return true;
    },
    value: {
      valid: true,
      message: {
        data: {
          fid: fid,
        },
      },
    },
  };
}

function mockNeynarResponse(fid: number, addresses: string[]) {
  const neynarResponse = {
    users: [
      {
        verifications: addresses,
      },
    ],
  };

  const getSSLHubRpcClientMock = require('@farcaster/hub-nodejs').getSSLHubRpcClient;
  const validateMock = getSSLHubRpcClientMock().validateMessage as jest.Mock;

  // Mock the response from the Farcaster hub
  validateMock.mockResolvedValue({
    isOk: () => true,
    value: { valid: true, message: { fid } },
  });

  validateMock.mockResolvedValue(buildFarcasterResponse(fid));
  // Mock the response from Neynar
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(neynarResponse),
    }),
  ) as jest.Mock;
  return {
    validateMock,
  };
}

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
    mockNeynarResponse(fid, addresses);

    const response = await getFrameAccountAddress(fakeFrameData, fakeApiKey);
    expect(response).toEqual(addresses[0]);
  });

  it('when the call from farcaster fails we should return undefined', async () => {
    const fid = 1234;
    const addresses = ['0xaddr1'];
    const { validateMock } = mockNeynarResponse(fid, addresses);
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
