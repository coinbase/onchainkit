import { ConnectWallet } from '@/wallet/components/ConnectWallet';
import { type ReactNode, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { border, cn, color, pressable, text } from '../../styles/theme';
import { useSignatureContext } from './SignatureProvider';

type SignatureButtonProps = {
  className?: string;
  disabled?: boolean;
  label?: ReactNode;
  connectLabel?: ReactNode;
  errorLabel?: ReactNode;
  successLabel?: ReactNode;
  pendingLabel?: ReactNode;
};

export function SignatureButton({
  className,
  disabled = false,
  label = 'Sign',
  connectLabel = 'Connect Wallet',
  errorLabel = 'Try again',
  successLabel = 'Signed',
  pendingLabel = 'Signing...',
}: SignatureButtonProps) {
  const { handleSign, lifecycleStatus } = useSignatureContext();
  const { address } = useAccount();

  const buttonLabel = useMemo(() => {
    if (lifecycleStatus.statusName === 'pending') {
      return pendingLabel;
    }

    if (lifecycleStatus.statusName === 'error') {
      return errorLabel;
    }

    if (lifecycleStatus.statusName === 'success') {
      return successLabel;
    }

    return label;
  }, [
    lifecycleStatus.statusName,
    label,
    errorLabel,
    successLabel,
    pendingLabel,
  ]);

  if (!address) {
    return (
      <ConnectWallet
        className={cn('w-full', className)}
        disconnectedLabel={connectLabel}
      />
    );
  }

  return (
    <button
      className={cn(
        pressable.primary,
        border.radius,
        'w-full rounded-xl',
        'px-4 py-3 font-medium leading-6',
        disabled && pressable.disabled,
        text.headline,
        color.inverse,
        className,
      )}
      type="button"
      onClick={handleSign}
      disabled={disabled}
    >
      {buttonLabel}
    </button>
  );
}
