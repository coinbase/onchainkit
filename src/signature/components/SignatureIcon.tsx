import { useMemo } from 'react';
import { Spinner } from '../../internal/components/Spinner';
import { ErrorSvg } from '../../internal/svg/errorSvg';
import { SuccessSvg } from '../../internal/svg/successSvg';
import { cn, text } from '../../styles/theme';
import { useSignatureContext } from './SignatureProvider';

type SignatureIconProps = {
  className?: string;
};

export function SignatureIcon({ className }: SignatureIconProps) {
  const { lifecycleStatus } = useSignatureContext();

  const icon = useMemo(() => {
    if (lifecycleStatus.statusName === 'success') {
      return <SuccessSvg />;
    }
    if (lifecycleStatus.statusName === 'error') {
      return <ErrorSvg />;
    }
    if (lifecycleStatus.statusName === 'pending') {
      return <Spinner className="px-1.5 py-1.5" />;
    }
    return null;
  }, [lifecycleStatus.statusName]);

  if (!icon) {
    return null;
  }

  return (
    <div className={cn(text.label2, className)} data-testid="ockSignatureIcon">
      {icon}
    </div>
  );
}
