import { type ReactNode, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/ui/Button';
import { ConnectWallet } from '@/wallet';
import {
  type SignatureContextType,
  useSignatureContext,
} from './SignatureProvider';
import { WithRenderProps } from '@/internal/types';

type SignatureButtonProps = WithRenderProps<
  {
    className?: string;
    disabled?: boolean;
    label?: ReactNode;
    errorLabel?: ReactNode;
    successLabel?: ReactNode;
    pendingLabel?: ReactNode;
    disconnectedLabel?: ReactNode;
    render?: ({
      label,
      onClick,
      context,
    }: {
      label: ReactNode;
      onClick: () => void;
      context: SignatureContextType;
    }) => ReactNode;
  },
  | 'className'
  | 'children'
  | 'label'
  | 'errorLabel'
  | 'successLabel'
  | 'pendingLabel'
  | 'disconnectedLabel'
>;

export function SignatureButton({
  className,
  disabled = false,
  label = 'Sign',
  errorLabel = 'Try again',
  successLabel = 'Signed',
  pendingLabel = 'Signing...',
  disconnectedLabel,
  render,
}: SignatureButtonProps) {
  const { address } = useAccount();

  const context = useSignatureContext();

  const {
    handleSign,
    lifecycleStatus: { statusName },
  } = context;

  const buttonLabel = useMemo(() => {
    if (statusName === 'pending') return pendingLabel;
    if (statusName === 'error') return errorLabel;
    if (statusName === 'success') return successLabel;
    return label;
  }, [statusName, label, errorLabel, successLabel, pendingLabel]);

  if (!address) return <ConnectWallet disconnectedLabel={disconnectedLabel} />;

  if (render) {
    return render({
      label: buttonLabel,
      onClick: handleSign,
      context,
    });
  }

  return (
    <Button onClick={handleSign} disabled={disabled} className={className}>
      {buttonLabel}
    </Button>
  );
}
