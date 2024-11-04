import type { LifecycleStatus, LifecycleStatusUpdate } from '../types';
type UseLifecycleStatusReturn = [
    lifecycleStatus: LifecycleStatus,
    updatelifecycleStatus: (newStatus: LifecycleStatusUpdate) => void
];
export declare function useLifecycleStatus(initialState: LifecycleStatus): UseLifecycleStatusReturn;
export {};
//# sourceMappingURL=useLifecycleStatus.d.ts.map