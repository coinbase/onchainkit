export function buildFarcasterResponse(fid: number) {
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

export function mockNeynarResponse(
  fid: number,
  addresses: string[] | undefined,
  lookupMock: jest.Mock,
) {
  const neynarResponse = {
    users: [
      {
        verifications: addresses,
      },
    ],
  };
  lookupMock.mockResolvedValue(neynarResponse);

  const getSSLHubRpcClientMock = require('@farcaster/hub-nodejs').getSSLHubRpcClient;
  const validateMock = getSSLHubRpcClientMock().validateMessage as jest.Mock;

  // Mock the response from the Farcaster hub
  validateMock.mockResolvedValue({
    isOk: () => true,
    value: { valid: true, message: { fid } },
  });

  validateMock.mockResolvedValue(buildFarcasterResponse(fid));

  return {
    validateMock,
  };
}
