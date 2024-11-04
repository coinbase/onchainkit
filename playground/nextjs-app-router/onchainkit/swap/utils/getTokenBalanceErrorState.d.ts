import type { UseBalanceReturnType, UseReadContractReturnType } from 'wagmi';
import type { Token } from '../../token';
type GetTokenBalancesErrorStateParams = {
    ethBalance?: UseBalanceReturnType;
    token?: Token;
    tokenBalance?: UseReadContractReturnType;
};
export declare function getTokenBalanceErrorState({ ethBalance, token, tokenBalance, }: GetTokenBalancesErrorStateParams): {
    error: string;
    code: string;
} | undefined;
export {};
//# sourceMappingURL=getTokenBalanceErrorState.d.ts.map