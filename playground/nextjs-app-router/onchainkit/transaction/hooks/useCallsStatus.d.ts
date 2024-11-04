import type { UseCallsStatusParams } from '../types';
export declare function useCallsStatus({ setLifecycleStatus, transactionId, }: UseCallsStatusParams): {
    status: "PENDING" | "CONFIRMED" | undefined;
    transactionHash: `0x${string}` | undefined;
} | {
    status: string;
    transactionHash: undefined;
};
//# sourceMappingURL=useCallsStatus.d.ts.map