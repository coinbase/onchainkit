import { copyToClipboard } from '@/core/utils/copyToClipboard';
import type { ReactNode } from 'react';

type CopyButtonProps = {
  label: string | ReactNode;
  copyValue: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  className?: string;
  'aria-label'?: string;
};

export function CopyButton({
  label,
  copyValue,
  onSuccess,
  onError,
  className,
  'aria-label': ariaLabel,
}: CopyButtonProps) {
  return (
    <button
      type="button"
      data-testid="ockCopyButton"
      className={className}
      onClick={() => copyToClipboard({ copyValue, onSuccess, onError })}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}
