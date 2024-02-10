/**
 * Frame address type to determine if the client is requesingt  verified address or a custody address
 *  Note: exported as public Type
 */

export enum FarcasterAddressType {
  VerifiedAddress,
  CustodyAddress,
}

/**
 * GetFarcasterUserAddressRequest
 *
 * Note: exported as public Type
 */
export interface GetFarcasterUserAddressRequest {
  fid: number;
  farcasterAddressType: FarcasterAddressType;
}
