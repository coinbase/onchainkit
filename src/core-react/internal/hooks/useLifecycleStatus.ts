import { useCallback, useState } from 'react';
import type {
  AbstractLifecycleStatus,
  LifecycleStatusUpdate,
  UseLifecycleStatusReturn,
} from '../types';

export function useLifecycleStatus<T extends AbstractLifecycleStatus>(
  initialState: T,
): UseLifecycleStatusReturn<T> {
  const [lifecycleStatus, setLifecycleStatus] = useState<T>(initialState); // Component lifecycle

  // Update lifecycle status, statusData will be persisted for the full lifecycle
  const updateLifecycleStatus = useCallback(
    (newStatus: LifecycleStatusUpdate<T>) => {
      setLifecycleStatus((prevStatus: T) => {
        // do not persist errors
        const persistedStatusData =
          prevStatus.statusName === 'error'
            ? (({ error, code, message, ...statusData }) => statusData)(
                prevStatus.statusData,
              )
            : prevStatus.statusData;
        return {
          statusName: newStatus.statusName,
          statusData: {
            ...persistedStatusData,
            ...newStatus.statusData,
          },
        } as T;
      });
    },
    [],
  );

  return [lifecycleStatus, updateLifecycleStatus];
}
