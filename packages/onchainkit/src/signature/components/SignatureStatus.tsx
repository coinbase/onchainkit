import { cn, color } from '../../styles/theme';
import { SignatureLabel } from './SignatureLabel';
import { useSignatureContext } from './SignatureProvider';

const DEFAULT_CHILDREN = <SignatureLabel />;

type SignatureStatusProps = {
  children?: React.ReactNode;
  className?: string;
};

export function SignatureStatus({
  children = DEFAULT_CHILDREN,
  className,
}: SignatureStatusProps) {
  const { lifecycleStatus } = useSignatureContext();
  return (
    <div
      className={cn(
        'flex justify-between',
        color.foregroundMuted,
        { [color.error]: lifecycleStatus.statusName === 'error' },
        className,
      )}
    >
      {children}
    </div>
  );
}
