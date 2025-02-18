import type { NFTError } from '@/api/types';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { MintEvent } from '@/core/analytics/types';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { useValue } from '@/internal/hooks/useValue';
import { createContext, useContext, useEffect } from 'react';
import type {
  LifecycleStatus,
  NFTLifecycleContextType,
  NFTLifecycleProviderReact,
} from '../types';

const emptyContext = {} as NFTLifecycleContextType;

export const NFTLifecycleContext =
  createContext<NFTLifecycleContextType>(emptyContext);

export function useNFTLifecycleContext() {
  const context = useContext(NFTLifecycleContext);
  if (context === emptyContext) {
    throw new Error(
      'useNFTLifecycleContext must be used within an NFTView or NFTMint component',
    );
  }
  return context;
}

export function NFTLifecycleProvider({
  type,
  onStatus,
  onError,
  onSuccess,
  children,
}: NFTLifecycleProviderReact) {
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>({
      statusName: 'init',
      statusData: null,
    }); // Component lifecycle

  const { sendAnalytics } = useAnalytics();

  // Component lifecycle emitters
  useEffect(() => {
    // Error
    if (lifecycleStatus.statusName === 'error') {
      const error = lifecycleStatus.statusData as NFTError;
      onError?.(error);
      sendAnalytics(MintEvent.MintFailure, {
        error: error.error,
        metadata: {
          code: error.code,
          message: error.message,
        },
      });
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
    sendAnalytics,
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
