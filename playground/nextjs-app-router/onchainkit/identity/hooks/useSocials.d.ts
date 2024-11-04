import type { Chain } from 'viem';
import type { GetSocialsReturnType, UseQueryOptions } from '../types';
type UseSocialsOptions = {
    ensName: string;
    chain?: Chain;
};
export declare const useSocials: ({ ensName, chain }: UseSocialsOptions, queryOptions?: UseQueryOptions) => import("@tanstack/react-query/build/legacy/types").UseQueryResult<GetSocialsReturnType, Error>;
export {};
//# sourceMappingURL=useSocials.d.ts.map