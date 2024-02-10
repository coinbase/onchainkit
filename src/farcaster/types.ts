/**
 * Frame address type to determine if the client is requesingt  verified address or a custody address
 *  Note: exported as public Type
 */

export enum FarcasterAddressType {
  VerifiedAddress,
  CustodyAddress,
}

/**
 * getFarcasterUserAddressRequest
 *
 * Note: exported as public Type
 */
export interface getFarcasterUserAddressRequest {
  fid: number;
  farcasterAddressType: FarcasterAddressType;
}
