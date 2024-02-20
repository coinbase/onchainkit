import { createFrameApiWallet } from './createFrameApiWallet';

describe('createFrameApiWallet', () => {
  let fetchMock = jest.fn();
  let status = 200;

  beforeEach(() => {
    jest.clearAllMocks();
    status = 200;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status,
        json: fetchMock,
      }),
    ) as jest.Mock;
  });

  it('should return undefined if no apiKey is passed', () => {
    // @ts-expect-error - Testing invalid input
    const result = createFrameApiWallet({});
    expect(result).resolves.toBeUndefined();
  });

  it('should return wallet addresses if the request is successful', async () => {
    fetchMock.mockResolvedValue({ success: true, data: { walletAddresses: ['0x1234'] } });
    const result = await createFrameApiWallet({ apiKey: 'test-api-key' });
    expect(result).toEqual(['0x1234']);
  });

  it('should return undefined if the request fails', async () => {
    fetchMock.mockResolvedValue({ success: false, error: 'test-error' });
    const result = await createFrameApiWallet({ apiKey: 'test-api-key' });
    expect(result).toBeUndefined();
  });

  it('should return undefined on a non-2xx response', async () => {
    status = 401;
    const result = await createFrameApiWallet({ apiKey: 'test-api-key' });
    expect(result).toBeUndefined();
  });
});
