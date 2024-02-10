import { getCustodyAddressForFidNeynar } from '../utils/neynar/user/getCustodyAddressForFidNeynar';
import { getVerifiedAddressesForFidNeynar } from '../utils/neynar/user/getVerifiedAddressesForFidNeynar';
import { FarcasterAddressType } from './types';
import { getFarcasterUserAddress } from './getFarcasterUserAddress';

jest.mock('../utils/neynar/user/getCustodyAddressForFidNeynar', () => ({
  getCustodyAddressForFidNeynar: jest.fn(),
}));

jest.mock('../utils/neynar/user/getVerifiedAddressesForFidNeynar', () => ({
  getVerifiedAddressesForFidNeynar: jest.fn(),
}));

describe('getFarcasterUserAddress function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return verified address when FarcasterAddressType is FarcasterAddressType.VerifiedAddress', async () => {
    const fid = 1234;
    const expectedAddress = 'verified address';
    const getFarcasterUserAddressRequest = {
      fid,
      farcasterAddressType: FarcasterAddressType.VerifiedAddress,
    };

    (getVerifiedAddressesForFidNeynar as jest.Mock).mockResolvedValue([expectedAddress]);

    const result = await getFarcasterUserAddress(getFarcasterUserAddressRequest);

    expect(getVerifiedAddressesForFidNeynar).toHaveBeenCalledWith(fid, undefined);
    expect(result).toEqual(expectedAddress);
  });

  test('should return custody address when FarcasterAddressType is FarcasterAddressType.CustodyAddress', async () => {
    const fid = 12345;
    const expectedAddress = 'custody address';
    const getFarcasterUserAddressRequest = {
      fid,
      farcasterAddressType: FarcasterAddressType.CustodyAddress,
    };

    (getCustodyAddressForFidNeynar as jest.Mock).mockResolvedValue(expectedAddress);

    const result = await getFarcasterUserAddress(getFarcasterUserAddressRequest);

    expect(getCustodyAddressForFidNeynar).toHaveBeenCalledWith(fid, undefined);
    expect(result).toEqual(expectedAddress);
  });

  test('should throw an error if an exception occurs', async () => {
    const fid = 1234;
    const error = new Error('Something went wrong');
    const getFarcasterUserAddressRequest = {
      fid,
      farcasterAddressType: FarcasterAddressType.VerifiedAddress,
    };

    (getVerifiedAddressesForFidNeynar as jest.Mock).mockRejectedValue(error);

    expect(await getFarcasterUserAddress(getFarcasterUserAddressRequest)).toBeNull();
  });

  test('should return verified address when FarcasterAddressType is FarcasterAddressType.VerifiedAddress and neynarApiKey is not undefined', async () => {
    const fid = 1234;
    const neynarApiKey = 'neynar';
    const expectedAddress = 'verified address';
    const anotherExpectedAddress = 'verified address-2';

    const getFarcasterUserAddressRequest = {
      fid,
      farcasterAddressType: FarcasterAddressType.VerifiedAddress,
    };
    const options = {
      neynarApiKey,
    };

    (getVerifiedAddressesForFidNeynar as jest.Mock).mockResolvedValue([
      expectedAddress,
      anotherExpectedAddress,
    ]);

    const result = await getFarcasterUserAddress(getFarcasterUserAddressRequest, options);

    expect(getVerifiedAddressesForFidNeynar).toHaveBeenCalledWith(fid, neynarApiKey);
    expect(result).toEqual(expectedAddress);
  });
});
