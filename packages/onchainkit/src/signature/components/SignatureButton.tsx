import { type ReactNode, useMemo } from 'react';
import { useSignatureContext } from './SignatureProvider';
import { Button } from '@/ui/Button';
import { useAccount } from 'wagmi';
import { ConnectWallet } from '@/wallet';

type SignatureButtonProps = {
  className?: string;
  disabled?: boolean;
  label?: ReactNode;
  errorLabel?: ReactNode;
  successLabel?: ReactNode;
  pendingLabel?: ReactNode;
  render?: ({
    label,
    onClick,
  }: {
    label: ReactNode;
    onClick: () => void;
  }) => ReactNode;
};

export function SignatureButton({
  className,
  disabled = false,
  label = 'Sign',
  errorLabel = 'Try again',
  successLabel = 'Signed',
  pendingLabel = 'Signing...',
  render,
}: SignatureButtonProps) {
  const { address } = useAccount();

  const {
    handleSign,
    lifecycleStatus: { statusName },
  } = useSignatureContext();

  const buttonLabel = useMemo(() => {
    if (statusName === 'pending') return pendingLabel;
    if (statusName === 'error') return errorLabel;
    if (statusName === 'success') return successLabel;
    return label;
  }, [statusName, label, errorLabel, successLabel, pendingLabel]);

  if (!address) return <ConnectWallet />;

  if (render) {
    return render({
      label: buttonLabel,
      onClick: handleSign,
    });
  }

  return (
    <Button onClick={handleSign} disabled={disabled} className={className}>
      {buttonLabel}
    </Button>
  );
}
