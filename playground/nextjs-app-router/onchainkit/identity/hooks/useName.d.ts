import type { GetNameReturnType, UseNameOptions, UseQueryOptions } from '../types';
/**
 * It leverages the `@tanstack/react-query` hook for fetching and optionally caching the ENS name
 * @returns An object containing:
 *  - `ensName`: The fetched ENS name for the provided address, or null if not found or in case of an error.
 *  - `{UseQueryResult}`: The rest of useQuery return values. including isLoading, isError, error, isFetching, refetch, etc.
 */
export declare const useName: ({ address, chain }: UseNameOptions, queryOptions?: UseQueryOptions) => import("@tanstack/react-query/build/legacy/types").UseQueryResult<GetNameReturnType, Error>;
//# sourceMappingURL=useName.d.ts.map