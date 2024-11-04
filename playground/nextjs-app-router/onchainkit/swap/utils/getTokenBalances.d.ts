import type { Token } from '../../token';
type GetTokenBalancesParams = {
    token?: Token;
    tokenBalance?: bigint;
    ethBalance?: bigint;
};
export declare function getTokenBalances({ ethBalance, token, tokenBalance, }: GetTokenBalancesParams): {
    convertedBalance: string;
    roundedBalance: string;
};
export {};
//# sourceMappingURL=getTokenBalances.d.ts.map