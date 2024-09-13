import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCustodyAddressForFidNeynar } from './getCustodyAddressForFidNeynar';

describe('getCustodyAddressForFidNeynar', () => {
  const fetchMock = vi.fn();
  let status = 200;

  beforeEach(() => {
    status = 200;
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status,
        json: fetchMock,
      }),
    ) as Mock;
  });

  it('should return mocked response correctly', async () => {
    const mockedResponse = {
      result: {
        custodyAddress: '0x00123',
      },
    };
    fetchMock.mockResolvedValue(mockedResponse);
    const resp = await getCustodyAddressForFidNeynar(42);
    expect(resp).toEqual('0x00123');
  });

  it('throw an error on a bad result', async () => {
    const mockedResponse = {
      badResult: {
        custodyAddress: '0x00123',
      },
    };
    fetchMock.mockResolvedValue(mockedResponse);
    expect.assertions(1);
    await expect(getCustodyAddressForFidNeynar(42)).rejects.toEqual(
      new Error('No custody address found for FID 42'),
    );
  });

  it('throw an error on missing custodyAddress', async () => {
    const mockedResponse = {
      result: {},
    };
    fetchMock.mockResolvedValue(mockedResponse);
    expect.assertions(1);
    await expect(getCustodyAddressForFidNeynar(42)).rejects.toEqual(
      new Error('No custody address found for FID 42'),
    );
  });
});
