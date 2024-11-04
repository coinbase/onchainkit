import type { UseWriteContractsParams } from '../types';
/**
 * useWriteContracts: Experimental Wagmi hook for batching transactions.
 * Supports Smart Wallets.
 * Supports batch operations and capabilities such as paymasters.
 * Does not support EOAs.
 */
export declare function useWriteContracts({ setLifecycleStatus, setTransactionId, }: UseWriteContractsParams): {
    status: "pending" | "error" | "success" | "idle";
    writeContractsAsync: import("@wagmi/core/experimental").WriteContractsMutateAsync<readonly import("viem").ContractFunctionParameters[], import("wagmi").Config, unknown>;
};
//# sourceMappingURL=useWriteContracts.d.ts.map