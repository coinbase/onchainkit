import { useContext, createContext, useEffect } from 'react';
import type {
  NftLifecycleContextType,
  NftLifecycleProviderReact,
} from '../types';
import { useValue } from '../../internal/hooks/useValue';
import { useLifecycleStatus } from '../hooks/useLifecycleStatus';

const emptyContext = {} as NftLifecycleContextType;

export const NftLifecycleContext =
  createContext<NftLifecycleContextType>(emptyContext);

export function useNftLifecycleContext() {
  const context = useContext(NftLifecycleContext);
  if (context === emptyContext) {
    throw new Error(
      'useNftLifecycleContext must be used within an NftView or NftMint component',
    );
  }
  return context;
}

export function NftLifecycleProvider({
  type,
  onStatus,
  onError,
  onSuccess,
  children,
}: NftLifecycleProviderReact) {
  const [lifecycleStatus, updateLifecycleStatus] = useLifecycleStatus({
    statusName: 'init',
    statusData: null,
  }); // Component lifecycle

  // Component lifecycle emitters
  useEffect(() => {
    // Error
    if (lifecycleStatus.statusName === 'error') {
      onError?.(lifecycleStatus.statusData);
    }
    // Success
    if (lifecycleStatus.statusName === 'success') {
      onSuccess?.(lifecycleStatus.statusData?.transactionReceipts?.[0]);
    }
    // Emit Status
    onStatus?.(lifecycleStatus);
  }, [
    onError,
    onStatus,
    onSuccess,
    lifecycleStatus,
    lifecycleStatus.statusData, // Keep statusData, so that the effect runs when it changes
    lifecycleStatus.statusName, // Keep statusName, so that the effect runs when it changes
  ]);

  const value = useValue({
    lifecycleStatus,
    type,
    updateLifecycleStatus,
  });

  return (
    <NftLifecycleContext.Provider value={value}>
      {children}
    </NftLifecycleContext.Provider>
  );
}
