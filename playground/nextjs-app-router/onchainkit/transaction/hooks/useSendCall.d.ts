import type { UseSendCallParams } from '../types';
/**
 * Wagmi hook for single transactions with calldata.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export declare function useSendCall({ setLifecycleStatus, transactionHashList, }: UseSendCallParams): {
    status: "pending" | "error" | "success" | "idle";
    sendCallAsync: import("wagmi/query").SendTransactionMutateAsync<import("wagmi").Config, unknown>;
    data: `0x${string}` | undefined;
};
//# sourceMappingURL=useSendCall.d.ts.map