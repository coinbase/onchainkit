import type { UseSendCallsParams } from '../types';
/**
 * useSendCalls: Experimental Wagmi hook for batching transactions with calldata.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
export declare function useSendCalls({ setLifecycleStatus, setTransactionId, }: UseSendCallsParams): {
    status: "pending" | "error" | "success" | "idle";
    sendCallsAsync: import("@wagmi/core/experimental").SendCallsMutateAsync<import("wagmi").Config, unknown>;
    data: string | undefined;
};
//# sourceMappingURL=useSendCalls.d.ts.map