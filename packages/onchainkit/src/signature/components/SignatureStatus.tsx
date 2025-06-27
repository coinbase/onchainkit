import { cn } from '../../styles/theme';
import { SignatureLabel } from './SignatureLabel';
import { useSignatureContext } from './SignatureProvider';

type SignatureStatusProps = {
  children?: React.ReactNode;
  className?: string;
};

export function SignatureStatus({
  children = <SignatureLabel />,
  className,
}: SignatureStatusProps) {
  const { lifecycleStatus } = useSignatureContext();
  return (
    <div
      className={cn(
        'flex justify-between',
        'text-ock-foreground-muted',
        { ['text-ock-error']: lifecycleStatus.statusName === 'error' },
        className,
      )}
    >
      {children}
    </div>
  );
}
