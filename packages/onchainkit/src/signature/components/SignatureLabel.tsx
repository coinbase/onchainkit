import { useMemo } from 'react';
import { cn, text } from '../../styles/theme';
import { useSignatureContext } from './SignatureProvider';

type SignatureLabelProps = {
  className?: string;
};

export function SignatureLabel({ className }: SignatureLabelProps) {
  const { lifecycleStatus } = useSignatureContext();

  const label = useMemo(() => {
    if (lifecycleStatus.statusName === 'success') {
      return 'Success';
    }
    if (lifecycleStatus.statusName === 'error') {
      return lifecycleStatus.statusData.message;
    }
    if (lifecycleStatus.statusName === 'pending') {
      return 'Confirm in wallet';
    }
    return null;
  }, [lifecycleStatus.statusName, lifecycleStatus.statusData]);

  if (!label) {
    return null;
  }

  return (
    <div className={cn(text.label2, className)} data-testid="ockSignatureLabel">
      {label}
    </div>
  );
}
