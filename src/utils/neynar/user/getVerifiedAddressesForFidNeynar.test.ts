import { getVerifiedAddressesForFidNeynar } from './getVerifiedAddressesForFidNeynar';

describe('getVerifiedAddressesForFidNeynar', () => {
  let fetchMock = jest.fn();
  let status = 200;

  beforeEach(() => {
    status = 200;
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status,
        json: fetchMock,
      }),
    ) as jest.Mock;
  });

  it('should return mocked response correctly', async () => {
    const mockedResponse = {
      result: {
        verifications: ['0x00123'],
      },
    };
    fetchMock.mockResolvedValue(mockedResponse);
    const resp = await getVerifiedAddressesForFidNeynar(42);
    expect(resp[0]).toEqual('0x00123');
  });

  it('throw an error on a bad result', async () => {
    const mockedResponse = {
      badResult: {
        verifications: ['0x00123'],
      },
    };
    fetchMock.mockResolvedValue(mockedResponse);
    try {
      await getVerifiedAddressesForFidNeynar(42);
    } catch (e) {
      expect(e).toHaveProperty('message', 'No verified addresses found for FID 42');
    }
  });

  it('throw an error on missing verifications', async () => {
    const mockedResponse = {
      result: {},
    };
    fetchMock.mockResolvedValue(mockedResponse);
    try {
      await getVerifiedAddressesForFidNeynar(42);
    } catch (e) {
      expect(e).toHaveProperty('message', 'No verified addresses found for FID 42');
    }
  });
});
