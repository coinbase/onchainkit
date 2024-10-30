/**
 * GetFarcasterUserAddressResponse
 *
 * Note: exported as public Type
 */
type GetFarcasterUserAddressResponse = {
    custodyAddress?: string;
    verifiedAddresses?: string[];
};

type GetFarcasterUserAddressOptions = {
    neynarApiKey?: string;
    hasCustodyAddress?: boolean;
    hasVerifiedAddresses?: boolean;
} | undefined;
/**
 * Get the user address for a given fid
 */
declare function getFarcasterUserAddress(fid: number, options?: GetFarcasterUserAddressOptions): Promise<GetFarcasterUserAddressResponse | null>;

export { type GetFarcasterUserAddressResponse, getFarcasterUserAddress };
