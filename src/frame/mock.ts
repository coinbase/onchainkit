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
  frameValidationMock: jest.Mock = jest.fn(),
) {
  const neynarResponse = {
    users: [
      {
        verifications: addresses,
      },
    ],
  };
  lookupMock.mockResolvedValue(neynarResponse);

  frameValidationMock.mockResolvedValue({
    valid: true,
    interactor: {
      fid,
      verified_accounts: addresses,
    },
  });
}
