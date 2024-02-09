/**
 * Frame address type to determine if the client is requesingt  verified addresses or a custody address
 *  Note: exported as public Type
 */

export enum FarcasterAddressType {
  VerifiedAddresses,
  CustodyAddress,
}

/**
 * GetFarcasterUserAddressesRequest
 *
 * Note: exported as public Type
 */
export interface GetFarcasterUserAddressesRequest {
  fid: number;
  farcasterAddressType: FarcasterAddressType;
}
