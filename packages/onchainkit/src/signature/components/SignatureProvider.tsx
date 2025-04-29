import { createContext, useCallback, useContext, useMemo } from 'react';
import { useIsMounted } from 'usehooks-ts';
import type { APIError } from '@/api/types';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { GENERIC_ERROR_MESSAGE } from '@/transaction/constants';
import { isUserRejectedRequestError } from '@/transaction/utils/isUserRejectedRequestError';
import { useSignData } from '../hooks/useSignData';
import { type LifecycleStatus, type MessageData } from '../types';

type SignatureContextType = {
  lifecycleStatus: LifecycleStatus;
  handleSign: () => Promise<void>;
};

const SignatureContext = createContext<SignatureContextType | null>(null);

export function useSignatureContext() {
  const context = useContext(SignatureContext);
  if (!context) {
    throw new Error(
      'useSignatureContext must be used within a SignatureProvider',
    );
  }
  return context;
}

export type SignatureProviderProps = {
  children: React.ReactNode;
} & {
  onSuccess?: (signature: string) => void;
  onError?: (error: APIError) => void;
  onStatus?: (status: LifecycleStatus) => void;
  resetAfter?: number;
} & MessageData;

export function SignatureProvider({
  children,
  onSuccess,
  onError,
  onStatus,
  domain,
  types,
  message,
  primaryType,
  resetAfter,
}: SignatureProviderProps) {
  const isMounted = useIsMounted();
  const { signData, resetSignData } = useSignData();

  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>(
      {
        statusName: 'init',
        statusData: null,
      },
      {
        onStatus: (status) => {
          onStatus?.(status);
          if (status.statusName === 'error') {
            onError?.(status.statusData);
          }

          if (status.statusName !== 'success') {
            return;
          }

          onSuccess?.(status.statusData.signature);

          if (resetAfter) {
            setTimeout(() => {
              if (!isMounted()) return;
              resetSignData();
              updateLifecycleStatus({
                statusName: 'init',
                statusData: null,
              });
            }, resetAfter);
          }
        },
      },
    );

  const handleSign = useCallback(async () => {
    updateLifecycleStatus({
      statusName: 'pending',
    });

    try {
      const signature = await signData({
        domain,
        types,
        message,
        primaryType,
      });

      updateLifecycleStatus({
        statusName: 'success',
        statusData: {
          signature,
        },
      });
    } catch (err) {
      const errorMessage = isUserRejectedRequestError(err)
        ? 'Request denied.'
        : GENERIC_ERROR_MESSAGE;
      updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          code: 'SmSPc01', // Signature module SignatureProvider component 01 error
          error: JSON.stringify(err),
          message: errorMessage,
        },
      });
    }
  }, [domain, types, message, primaryType, updateLifecycleStatus, signData]);

  const contextValue = useMemo(
    () => ({
      lifecycleStatus,
      handleSign,
    }),
    [lifecycleStatus, handleSign],
  );

  return (
    <SignatureContext.Provider value={contextValue}>
      {children}
    </SignatureContext.Provider>
  );
}
