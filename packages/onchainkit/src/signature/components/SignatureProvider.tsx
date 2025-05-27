import type { APIError } from '@/api/types';
import { useLifecycleStatus } from '@/internal/hooks/useLifecycleStatus';
import { useValue } from '@/internal/hooks/useValue';
import { GENERIC_ERROR_MESSAGE } from '@/transaction/constants';
import { isUserRejectedRequestError } from '@/transaction/utils/isUserRejectedRequestError';
import { createContext, useContext, useEffect } from 'react';
import { useSignMessage, useSignTypedData } from 'wagmi';
import type {
  SignMessageParameters,
  SignTypedDataParameters,
} from 'wagmi/actions';
import {
  type LifecycleStatus,
  MessageType,
  type SignatureProviderProps,
} from '../types';
import { validateMessage } from '../utils/validateMessage';

type SignatureContextType = {
  lifecycleStatus: LifecycleStatus;
  handleSign: () => Promise<void>;
};

const EMPTY_CONTEXT = {} as SignatureContextType;

const SignatureContext = createContext<SignatureContextType>(EMPTY_CONTEXT);

export function useSignatureContext() {
  const context = useContext(SignatureContext);
  if (context === EMPTY_CONTEXT) {
    throw new Error(
      'useSignatureContext must be used within a SignatureProvider',
    );
  }
  return context;
}

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
  const { signTypedDataAsync, reset: resetSignTypedData } = useSignTypedData();
  const { signMessageAsync, reset: resetSignMessage } = useSignMessage();
  const [lifecycleStatus, updateLifecycleStatus] =
    useLifecycleStatus<LifecycleStatus>({
      statusName: 'init',
      statusData: null,
    });

  useEffect(() => {
    onStatus?.(lifecycleStatus);
  }, [lifecycleStatus, onStatus]);

  useEffect(() => {
    if (lifecycleStatus.statusName === 'success' && resetAfter) {
      const timeoutId = setTimeout(() => {
        resetSignMessage();
        resetSignTypedData();
        updateLifecycleStatus({
          statusName: 'init',
          statusData: null,
        });
      }, resetAfter);

      return () => clearTimeout(timeoutId);
    }
  }, [
    updateLifecycleStatus,
    lifecycleStatus,
    resetAfter,
    resetSignMessage,
    resetSignTypedData,
  ]);

  async function handleSignTypedData({
    domain,
    types,
    message,
    primaryType,
  }: SignTypedDataParameters) {
    const signature = await signTypedDataAsync({
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
    onSuccess?.(signature);
  }

  async function handleSignMessage({ message }: SignMessageParameters) {
    const signature = await signMessageAsync({ message });
    updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        signature,
      },
    });
    onSuccess?.(signature);
  }

  function handleError(err: unknown) {
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
    onError?.(err as APIError);
  }

  async function handleSign() {
    updateLifecycleStatus({
      statusName: 'pending',
    });

    try {
      const validatedMessage = validateMessage({
        domain,
        types,
        message,
        primaryType,
      });
      if (validatedMessage.type === MessageType.TYPED_DATA) {
        await handleSignTypedData(validatedMessage.data);
      } else if (validatedMessage.type === MessageType.SIGNABLE_MESSAGE) {
        await handleSignMessage(validatedMessage.data);
      } else if (validatedMessage.type === MessageType.INVALID) {
        throw new Error('Invalid message data');
      }
    } catch (err) {
      handleError(err);
    }
  }

  const value = useValue({
    lifecycleStatus,
    handleSign,
  });

  return (
    <SignatureContext.Provider value={value}>
      {children}
    </SignatureContext.Provider>
  );
}
