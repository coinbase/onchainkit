import { getFrameApiTxHash } from './getFrameApiTxHash';

describe('getFrameApiTxHash', () => {
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

  it('should return undefined if no args are passed', () => {
    // @ts-expect-error - Testing invalid input
    const result = getFrameApiTxHash({});
    expect(result).resolves.toBeUndefined();
  });

  it('should return wallet addresses if the request is successful', async () => {
    fetchMock.mockResolvedValue({ success: true, data: { transactionHash: '0x1234' } });
    const result = await getFrameApiTxHash({
      apiKey: 'test-api-key',
      transactionId: 'test-id-123',
    });
    expect(result).toEqual('0x1234');
  });

  it('should return undefined if the request fails', async () => {
    fetchMock.mockResolvedValue({ success: false, error: 'test-error' });
    const result = await getFrameApiTxHash({
      apiKey: 'test-api-key',
      transactionId: 'test-id-123',
    });
    expect(result).toBeUndefined();
  });

  it('should return undefined on a non-2xx response', async () => {
    status = 401;
    const result = await getFrameApiTxHash({
      apiKey: 'test-api-key',
      transactionId: 'test-id-123',
    });
    expect(result).toBeUndefined();
  });
});
