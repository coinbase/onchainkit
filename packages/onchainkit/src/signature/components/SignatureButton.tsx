import { type ReactNode, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/ui/Button';
import { ConnectWallet } from '@/wallet';
import {
  type SignatureContextType,
  useSignatureContext,
} from './SignatureProvider';
import { WithRenderProps } from '@/internal/types';

type SignatureButtonProps = WithRenderProps<{
  /** CSS class to apply to the button */
  className?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Text displayed on the button in pending state */
  label?: ReactNode;
  /** Text displayed when signature fails */
  errorLabel?: ReactNode;
  /** Text displayed after successful signature */
  successLabel?: ReactNode;
  /** Text displayed while waiting for signature */
  pendingLabel?: ReactNode;
  /** Text displayed when wallet is disconnected */
  disconnectedLabel?: ReactNode;
  /** Custom render function for complete control of button rendering */
  render?: ({
    label,
    onClick,
    context,
  }: {
    label: ReactNode;
    onClick: () => void;
    context: SignatureContextType;
  }) => ReactNode;
}>;

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
