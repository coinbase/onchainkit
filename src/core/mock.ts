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

export function mockNeynarResponse(fid: number, addresses: string[], isOk = true) {
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
    isOk: () => isOk,
    value: { valid: isOk, message: { fid } },
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
