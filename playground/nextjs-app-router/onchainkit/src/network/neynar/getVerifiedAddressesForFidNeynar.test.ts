import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getVerifiedAddressesForFidNeynar } from './getVerifiedAddressesForFidNeynar';

describe('getVerifiedAddressesForFidNeynar', () => {
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
      users: [
        {
          verifications: ['0x00123'],
        },
      ],
    };
    fetchMock.mockResolvedValue(mockedResponse);
    const resp = await getVerifiedAddressesForFidNeynar(42);
    expect(resp[0]).toEqual('0x00123');
  });

  it('throw an error on a bad result', async () => {
    const mockedResponse = {
      badResult: [
        {
          verifications: ['0x00123'],
        },
      ],
    };
    fetchMock.mockResolvedValue(mockedResponse);
    expect.assertions(1);
    await expect(getVerifiedAddressesForFidNeynar(42)).rejects.toEqual(
      new Error('No verified addresses found for FID 42'),
    );
  });

  it('throw an error on missing user', async () => {
    const mockedResponse = {
      users: [],
    };
    fetchMock.mockResolvedValue(mockedResponse);
    expect.assertions(1);
    await expect(getVerifiedAddressesForFidNeynar(42)).rejects.toEqual(
      new Error('No verified addresses found for FID 42'),
    );
  });

  it('throw an error on missing verifications', async () => {
    const mockedResponse = {
      users: [{}],
    };
    fetchMock.mockResolvedValue(mockedResponse);
    expect.assertions(1);
    await expect(getVerifiedAddressesForFidNeynar(42)).rejects.toEqual(
      new Error('No verified addresses found for FID 42'),
    );
  });
});
