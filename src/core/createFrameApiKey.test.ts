import { createFrameApiKey } from './createFrameApiKey';

describe('createFrameApiKey', () => {
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

  it('should return undefined if an un supported chain ID is passed', () => {
    // @ts-expect-error - Testing invalid input
    const result = createFrameApiKey({ chainId: 123 });
    expect(result).resolves.toBeUndefined();
  });

  it('should return the API key if the request is successful', async () => {
    fetchMock.mockResolvedValue({ success: true, data: { apiKey: 'test-key' } });
    const result = await createFrameApiKey({ chainId: 5101 });
    expect(result).toEqual('test-key');
  });

  it('should return undefined if the request fails', async () => {
    fetchMock.mockResolvedValue({ success: false, error: 'test-error' });
    const result = await createFrameApiKey({ chainId: 5101 });
    expect(result).toBeUndefined();
  });

  it('should return undefined on a non-2xx response', async () => {
    status = 401;
    const result = await createFrameApiKey({ chainId: 5101 });
    expect(result).toBeUndefined();
  });
});
