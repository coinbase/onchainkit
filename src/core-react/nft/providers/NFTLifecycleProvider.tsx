import { createContext, useContext, useEffect } from 'react';
import { useValue } from '../../internal/hooks/useValue';
import { useLifecycleStatus } from '../hooks/useLifecycleStatus';
import type {
  LifecycleStatus,
  NFTLifecycleContextType,
  NFTLifecycleProviderReact,
} from '../types';
import type { TransactionReceipt } from 'viem';
import type { NFTError } from '@/core/api/types';

const emptyContext = {} as NFTLifecycleContextType<LifecycleStatus>;

export const NFTLifecycleContext =
  createContext<NFTLifecycleContextType<LifecycleStatus>>(emptyContext);

export function useNFTLifecycleContext() {
  const context = useContext(NFTLifecycleContext);
  if (context === emptyContext) {
    throw new Error(
      'useNFTLifecycleContext must be used within an NFTView or NFTMint component',
    );
  }
  return context;
}

export function NFTLifecycleProvider<T extends LifecycleStatus>({
  type,
  onStatus,
  onError,
  onSuccess,
  children,
  initialState = { statusName: 'init', statusData: null } as T,
}: NFTLifecycleProviderReact<T>) {
  const [lifecycleStatus, updateLifecycleStatus] = useLifecycleStatus<T>(initialState); // Component lifecycle

  // Component lifecycle emitters
  useEffect(() => {
    // Error
    if (lifecycleStatus.statusName === 'error') {
      onError?.(lifecycleStatus.statusData as NFTError);
    }
    // Success
    if (lifecycleStatus.statusName === 'success') {
      onSuccess?.(lifecycleStatus.statusData?.transactionReceipts?.[0] as unknown as TransactionReceipt);
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
    <NFTLifecycleContext.Provider value={value}>
      {children}
    </NFTLifecycleContext.Provider>
  );
}
