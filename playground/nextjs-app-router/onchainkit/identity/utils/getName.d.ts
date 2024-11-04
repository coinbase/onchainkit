import type { GetName, GetNameReturnType } from '../types';
/**
 * An asynchronous function to fetch the Ethereum Name Service (ENS)
 * name for a given Ethereum address. It returns the ENS name if it exists,
 * or null if it doesn't or in case of an error.
 */
export declare const getName: ({ address, chain, }: GetName) => Promise<GetNameReturnType>;
//# sourceMappingURL=getName.d.ts.map