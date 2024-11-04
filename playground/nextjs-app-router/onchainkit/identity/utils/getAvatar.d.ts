import type { GetAvatar, GetAvatarReturnType } from '../types';
/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * avatar for a given Ethereum name. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */
export declare const getAvatar: ({ ensName, chain, }: GetAvatar) => Promise<GetAvatarReturnType>;
//# sourceMappingURL=getAvatar.d.ts.map