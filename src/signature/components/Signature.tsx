import { useIsMounted } from '@/internal/hooks/useIsMounted';
import { useTheme } from '@/internal/hooks/useTheme';
import { cn } from '@/styles/theme';
import type { SignatureReact } from '../types';
import { SignatureButton } from './SignatureButton';
import { SignatureProvider } from './SignatureProvider';
import { SignatureStatus } from './SignatureStatus';
import { SignatureToast } from './SignatureToast';

function SignatureDefaultContent({
  label,
  disabled,
}: Pick<SignatureReact, 'label' | 'disabled'>) {
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
}: SignatureReact) {
  const isMounted = useIsMounted();
  const componentTheme = useTheme();

  if (!isMounted) {
    return (
      <div
        className={cn(componentTheme, 'flex w-full flex-col gap-2', className)}
      />
    );
  }

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
        {children ?? (
          <SignatureDefaultContent label={label} disabled={disabled} />
        )}
      </div>
    </SignatureProvider>
  );
}
