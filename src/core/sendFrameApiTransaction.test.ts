import { sendFrameApiTransaction } from './sendFrameApiTransaction';

describe('sendFrameApiTransaction', () => {
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
    const result = sendFrameApiTransaction({});
    expect(result).resolves.toBeUndefined();
  });

  it('should return undefined if mandatory args are not passed', () => {
    // @ts-expect-error - Testing invalid input
    const result = sendFrameApiTransaction({
      frameTrustedData: '0x1234',
      contractAddress: '0x1234',
      functionSignature: 'mint(address to)',
      args: { to: '0x1234' },
    });
    expect(result).resolves.toBeUndefined();

    // @ts-expect-error - Testing invalid input
    const result1 = sendFrameApiTransaction({
      apiKey: 'test-api-key',
      contractAddress: '0x1234',
      functionSignature: 'mint(address to)',
      args: { to: '0x1234' },
    });
    expect(result1).resolves.toBeUndefined();

    // @ts-expect-error - Testing invalid input
    const result2 = sendFrameApiTransaction({
      apiKey: 'test-api-key',
      frameTrustedData: '0x1234',
      functionSignature: 'mint(address to)',
      args: { to: '0x1234' },
    });
    expect(result2).resolves.toBeUndefined();

    // @ts-expect-error - Testing invalid input
    const result3 = sendFrameApiTransaction({
      apiKey: 'test-api-key',
      frameTrustedData: '0x1234',
      contractAddress: '0x1234',
      args: { to: '0x1234' },
    });
    expect(result3).resolves.toBeUndefined();

    // @ts-expect-error - Testing invalid input
    const result4 = sendFrameApiTransaction({
      apiKey: 'test-api-key',
      frameTrustedData: '0x1234',
      contractAddress: '0x1234',
      functionSignature: 'mint(address to)',
    });
    expect(result4).resolves.toBeUndefined();
  });

  it('should return a transaction ID & user address if the request is successful', async () => {
    fetchMock.mockResolvedValue({
      success: true,
      data: { transactionId: '1234-test-id', userAddress: '0x1234' },
    });
    const result = await sendFrameApiTransaction({
      apiKey: 'test-api-key',
      frameTrustedData: '0x1234',
      contractAddress: '0x1234',
      functionSignature: 'mint(address to)',
      args: { to: '0x1234' },
    });
    expect(result).toStrictEqual({ transactionId: '1234-test-id', userAddress: '0x1234' });
  });

  it('should return undefined if the request fails', async () => {
    fetchMock.mockResolvedValue({ success: false, error: 'test-error' });
    const result = await sendFrameApiTransaction({
      apiKey: 'test-api-key',
      frameTrustedData: '0x1234',
      contractAddress: '0x1234',
      functionSignature: 'mint(address to)',
      args: { to: '0x1234' },
    });
    expect(result).toBeUndefined();
  });

  it('should return undefined on a non-2xx response', async () => {
    status = 401;
    const result = await sendFrameApiTransaction({
      apiKey: 'test-api-key',
      frameTrustedData: '0x1234',
      contractAddress: '0x1234',
      functionSignature: 'mint(address to)',
      args: { to: '0x1234' },
    });
    expect(result).toBeUndefined();
  });
});
