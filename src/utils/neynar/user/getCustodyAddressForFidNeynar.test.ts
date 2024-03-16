import { getCustodyAddressForFidNeynar } from './getCustodyAddressForFidNeynar';

describe('getCustodyAddressForFidNeynar', () => {
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
    try {
      await getCustodyAddressForFidNeynar(42);
    } catch (e) {
      expect(e).toHaveProperty('message', 'No custody address found for FID 42');
    }
  });

  it('throw an error on missing custodyAddress', async () => {
    const mockedResponse = {
      result: {},
    };
    fetchMock.mockResolvedValue(mockedResponse);
    try {
      await getCustodyAddressForFidNeynar(42);
    } catch (e) {
      expect(e).toHaveProperty('message', 'No custody address found for FID 42');
    }
  });
});
