import { useContext, createContext, useEffect } from "react";
import { useSignMessage, useSignTypedData } from "wagmi";
import type { LifecycleStatus } from "../types";
import { useValue } from "@/internal/hooks/useValue";
import type { SignTypedDataVariables } from "wagmi/query";
import { useLifecycleStatus } from "@/internal/hooks/useLifecycleStatus";
import type { APIError } from "@/api/types";

/*******
 * Add connect OR auto connect then sign
 * add toast support and error states (i.e. request denied)
 */


type SignatureContextType = {
  lifecycleStatus: LifecycleStatus;
  handleSign: () => Promise<void>;
};

const EMPTY_CONTEXT = {} as SignatureContextType;

const SignatureContext = createContext<SignatureContextType>(EMPTY_CONTEXT);

export function useSignatureContext() {
  const context = useContext(SignatureContext);
  if (context === EMPTY_CONTEXT) {
    throw new Error('useSignatureContext must be used within a SignatureProvider');
  }
  return context;
}

type SignatureProviderProps = {
  domain: SignTypedDataVariables['domain'];
  types: SignTypedDataVariables['types'];
  message: SignTypedDataVariables['message'] | string;
  primaryType: SignTypedDataVariables['primaryType'];
  children: React.ReactNode;
  onSuccess?: (signature: string) => void;
  onError?: (error: APIError) => void;
  onStatus?: (status: LifecycleStatus) => void;
};

export function SignatureProvider({ children, onSuccess, onError, onStatus, domain, types, message, primaryType }: SignatureProviderProps) {
  const { signTypedDataAsync } = useSignTypedData();
  const { signMessageAsync } = useSignMessage();
  const [lifecycleStatus, updateLifecycleStatus] = useLifecycleStatus<LifecycleStatus>({
    statusName: 'init',
    statusData: {
      type: domain && types && typeof message !== 'string' ? 'typed_message' : 'message'
    },
  })

  useEffect(() => {
    onStatus?.(lifecycleStatus);
  }, [lifecycleStatus, onStatus])

  async function handleSign() {
    updateLifecycleStatus({
      statusName: 'pending',
    });

    try {
      if (domain && types && typeof message !== 'string') {
        const signature = await signTypedDataAsync({ domain, types, message, primaryType });
        if (signature) {
          updateLifecycleStatus({
          statusName: 'success',
            statusData: signature
          })
          onSuccess?.(signature);
        } else {
          throw new Error("No signature returned");
        }
      } else if (typeof message === 'string') {
        const signature = await signMessageAsync({ message });
        if (signature) {
          updateLifecycleStatus({
            statusName: 'success',
            statusData: signature
          })
          onSuccess?.(signature);
        } else {
          throw new Error("No signature returned");
        }
      } else {
        throw new Error("Invalid message type");
      }
    } catch (err) {
      onError?.(err as APIError);
    }
  }

  const value = useValue({
    lifecycleStatus,
    handleSign
  });

  return (
    <SignatureContext.Provider value={value}>
      {children}
    </SignatureContext.Provider>
  );
}