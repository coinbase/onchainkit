import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { useEffect, useMemo } from 'react';
import type { LifecycleEvents, LifecycleStatus } from '../types';

export const useEmitLifecycleStatus = ({
  onError,
  onSuccess,
  onStatus,
}: LifecycleEvents) => {
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>({
      statusName: 'init',
      statusData: null,
    });

  // Lifecycle emitters
  useEffect(() => {
    // Error
    if (lifecycleStatus.statusName === 'error') {
      onError?.(lifecycleStatus.statusData);
    }
    // Success
    if (lifecycleStatus.statusName === 'transactionSuccess') {
      onSuccess?.(lifecycleStatus.statusData);
    }
    // Emit Status
    onStatus?.(lifecycleStatus);
  }, [
    onError,
    onStatus,
    onSuccess,
    lifecycleStatus,
    lifecycleStatus.statusData,
    lifecycleStatus.statusName,
  ]);

  return useMemo(
    () => ({ lifecycleStatus, updateLifecycleStatus }),
    [lifecycleStatus, updateLifecycleStatus],
  );
};
