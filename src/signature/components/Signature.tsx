import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useTheme } from '@/internal/hooks/useTheme';
import { cn } from '@/styles/theme';
import { SignatureProvider } from './SignatureProvider';
import type { SignTypedDataVariables } from 'wagmi/query';
import type { APIError } from '@/api/types';
import type { LifecycleStatus } from "../types";

type SignatureProps = {
  chainId?: number;
  className?: string;
  domain: SignTypedDataVariables['domain'];
  types: SignTypedDataVariables['types'];
  message: SignTypedDataVariables['message'];
  primaryType: SignTypedDataVariables['primaryType'];
  children?: React.ReactNode;
  onSuccess?: (signature: string) => void;
  onStatus?: (status: LifecycleStatus) => void;
  onError?: (error: APIError) => void;
};

export function Signature({
  className,
  domain,
  types,
  message,
  primaryType,
  children,
  onSuccess,
  onStatus,
  onError
}: SignatureProps) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();

  if (!isMounted) {
    return (
      <div className={cn(componentTheme, 'flex w-full flex-col gap-2', className)} />
    );
  }

  // const accountChainId = chainId ?? chain.id;

  return (
    <SignatureProvider 
      onSuccess={onSuccess} 
      onStatus={onStatus} 
      onError={onError} 
      domain={domain} 
      types={types} 
      message={message} 
      primaryType={primaryType}
    >
      <div className={cn(componentTheme, 'flex w-full flex-col gap-2', className)}>
        {children}
      </div>
    </SignatureProvider>
  );
}

// type SignatureToastProps = {
//   className?: string;
//   children?: React.ReactNode;
// };

// export function SignatureToast({ className, children }: SignatureToastProps) {
//   const { status, error } = useSignatureContext();
  
//   return (
//     <div className={cn('flex items-center gap-2 rounded-lg bg-gray-100 p-4', className)}>
//       {status === 'signing' && <div>Signing...</div>}
//       {status === 'success' && <div>Signature complete!</div>}
//       {status === 'error' && <div>Error: {error?.message}</div>}
//       {children}
//     </div>
//   );
// }
