import type { Chain } from 'viem';
import type { GetSocialsReturnType } from '../types';
export type GetSocials = {
    ensName: string;
    chain?: Chain;
};
export declare const getSocials: ({ ensName, chain, }: GetSocials) => Promise<GetSocialsReturnType>;
//# sourceMappingURL=getSocials.d.ts.map