'use client';

import { copyToClipboard } from '@/internal/utils/copyToClipboard';
import { type ReactNode, useCallback } from 'react';

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
  const handleCopy = useCallback(
    () => copyToClipboard({ copyValue, onSuccess, onError }),
    [copyValue, onSuccess, onError],
  );

  return (
    <button
      type="button"
      data-testid="ockCopyButton"
      className={className}
      onClick={handleCopy}
      onKeyDown={handleCopy}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}
