import type { GetFarcasterUserAddressResponse } from './types';
type GetFarcasterUserAddressOptions = {
    neynarApiKey?: string;
    hasCustodyAddress?: boolean;
    hasVerifiedAddresses?: boolean;
} | undefined;
/**
 * Get the user address for a given fid
 */
declare function getFarcasterUserAddress(fid: number, options?: GetFarcasterUserAddressOptions): Promise<GetFarcasterUserAddressResponse | null>;
export { getFarcasterUserAddress };
//# sourceMappingURL=getFarcasterUserAddress.d.ts.map