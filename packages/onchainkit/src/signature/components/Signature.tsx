import type {
  SignMessageParameters,
  SignTypedDataParameters,
} from 'wagmi/actions';
import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useTheme } from '@/internal/hooks/useTheme';
import { cn } from '@/styles/theme';
import type { APIError } from '@/api/types';
import type { LifecycleStatus } from '../types';
import { SignatureButton } from './SignatureButton';
import { SignatureProvider } from './SignatureProvider';
import { SignatureStatus } from './SignatureStatus';
import { SignatureToast } from './SignatureToast';

export type SignatureProps = {
  chainId?: number;
  className?: string;
  onSuccess?: (signature: string) => void;
  onStatus?: (status: LifecycleStatus) => void;
  onError?: (error: APIError) => void;
  resetAfter?: number;
} & (
  | {
      domain?: SignTypedDataParameters['domain'];
      types: SignTypedDataParameters['types'];
      message: SignTypedDataParameters['message'];
      primaryType: SignTypedDataParameters['primaryType'];
    }
  | {
      message: SignMessageParameters['message'];
      domain?: never;
      types?: never;
      primaryType?: never;
    }
) &
  (
    | {
        children: React.ReactNode;
        label?: never;
        disabled?: never;
      }
    | {
        children?: never;
        label?: React.ReactNode;
        disabled?: boolean;
      }
  );

function DefaultChildren({
  label,
  disabled,
}: Pick<SignatureProps, 'label' | 'disabled'>) {
  return (
    <>
      <SignatureButton label={label} disabled={disabled} />
      <SignatureStatus />
      <SignatureToast />
    </>
  );
}

export function Signature({
  className,
  domain,
  types,
  message,
  primaryType,
  children,
  label,
  disabled = false,
  onSuccess,
  onStatus,
  onError,
  resetAfter,
}: SignatureProps) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();

  if (!isMounted) return null;

  return (
    <SignatureProvider
      onSuccess={onSuccess}
      onStatus={onStatus}
      onError={onError}
      domain={domain}
      types={types}
      message={message}
      primaryType={primaryType}
      resetAfter={resetAfter}
    >
      <div
        className={cn(componentTheme, 'flex w-full flex-col gap-2', className)}
      >
        {children ?? <DefaultChildren label={label} disabled={disabled} />}
      </div>
    </SignatureProvider>
  );
}
