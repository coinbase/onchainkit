import { neynarGetCustodyAddressesForFid } from '../utils/neynar/frame/neynarGetCustodyAddressForFid';
import { neynarGetVerifiedAddressesForFid } from '../utils/neynar/frame/neynarGetVerifiedAddressesForFid';
import { FarcasterAddressType } from './types';
import { getFarcasterUserAddresses } from './getFarcasterUserAddresses';

jest.mock('../utils/neynar/frame/neynarGetCustodyAddressForFid', () => ({
  neynarGetCustodyAddressesForFid: jest.fn(),
}));

jest.mock('../utils/neynar/frame/neynarGetVerifiedAddressesForFid', () => ({
  neynarGetVerifiedAddressesForFid: jest.fn(),
}));

describe('getFarcasterUserAddresses function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return verified address when FarcasterAddressType is FarcasterAddressType.VerifiedAddresses', async () => {
    const fid = 1234;
    const expectedAddress = 'verified address';
    const getFarcasterUserAddressesRequest = {
      fid,
      farcasterAddressType: FarcasterAddressType.VerifiedAddresses,
    };

    (neynarGetVerifiedAddressesForFid as jest.Mock).mockResolvedValue([expectedAddress]);

    const result = await getFarcasterUserAddresses(getFarcasterUserAddressesRequest);

    expect(neynarGetVerifiedAddressesForFid).toHaveBeenCalledWith(fid, undefined);
    expect(result).toEqual([expectedAddress]);
  });

  test('should return custody address when FarcasterAddressType is FarcasterAddressType.CustodyAddress', async () => {
    const fid = 12345;
    const expectedAddress = 'custody address';
    const getFarcasterUserAddressesRequest = {
      fid,
      farcasterAddressType: FarcasterAddressType.CustodyAddress,
    };

    (neynarGetCustodyAddressesForFid as jest.Mock).mockResolvedValue(expectedAddress);

    const result = await getFarcasterUserAddresses(getFarcasterUserAddressesRequest);

    expect(neynarGetCustodyAddressesForFid).toHaveBeenCalledWith(fid, undefined);
    expect(result).toEqual(expectedAddress);
  });

  test('should throw an error if an exception occurs', async () => {
    const fid = 1234;
    const error = new Error('Something went wrong');
    const getFarcasterUserAddressesRequest = {
      fid,
      farcasterAddressType: FarcasterAddressType.VerifiedAddresses,
    };

    (neynarGetVerifiedAddressesForFid as jest.Mock).mockRejectedValue(error);

    await expect(getFarcasterUserAddresses(getFarcasterUserAddressesRequest)).rejects.toThrow(
      error,
    );
  });
});
