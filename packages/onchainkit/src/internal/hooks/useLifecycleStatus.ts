import type {
  AbstractLifecycleStatus,
  LifecycleStatusUpdate,
  UseLifecycleStatusReturn,
} from '@/internal/types';
import { useCallback, useState } from 'react';

export function useLifecycleStatus<T extends AbstractLifecycleStatus>(
  initialState: T,
  options?: {
    onStatus?: (status: T) => void;
  },
): UseLifecycleStatusReturn<T> {
  const [lifecycleStatus, setLifecycleStatus] = useState<T>(initialState); // Component lifecycle
  const { onStatus } = options ?? {};

  // Update lifecycle status, statusData will be persisted for the full lifecycle
  const updateLifecycleStatus = useCallback(
    (newStatus: LifecycleStatusUpdate<T>) => {
      setLifecycleStatus((prevStatus: T) => {
        // do not persist errors
        const persistedStatusData =
          prevStatus.statusName === 'error'
            ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
              (({ error, code, message, ...statusData }) => statusData)(
                prevStatus.statusData,
              )
            : prevStatus.statusData;
        const nextStatus = {
          statusName: newStatus.statusName,
          statusData: {
            ...persistedStatusData,
            ...newStatus.statusData,
          },
        } as T;
        onStatus?.(nextStatus);
        return nextStatus;
      });
    },
    [onStatus],
  );

  return [lifecycleStatus, updateLifecycleStatus];
}
