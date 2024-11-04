import type { UseWriteContractParams } from '../types';
/**
 * Wagmi hook for single contract transactions.
 * Supports both EOAs and Smart Wallets.
 * Does not support transaction batching or paymasters.
 */
export declare function useWriteContract({ setLifecycleStatus, transactionHashList, }: UseWriteContractParams): {
    status: "pending" | "error" | "success" | "idle";
    writeContractAsync: import("wagmi/query").WriteContractMutateAsync<import("wagmi").Config, unknown>;
    data: `0x${string}` | undefined;
};
//# sourceMappingURL=useWriteContract.d.ts.map