'use client';

import { useCopyToClipboard } from '@/internal/hooks/useCopyToClipboard';
import { type ReactNode, useCallback } from 'react';

type CopyButtonProps = {
  label: string | ReactNode;
  copyValue: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  onReset?: () => void;
  className?: string;
  'aria-label'?: string;
};

export function CopyButton({
  label,
  copyValue,
  onSuccess,
  onError,
  onReset,
  className,
  'aria-label': ariaLabel,
}: CopyButtonProps) {
  const copyToClipboard = useCopyToClipboard({
    onSuccess,
    onError,
    onReset,
  });

  const handleCopy = useCallback(
    () => copyToClipboard(copyValue),
    [copyToClipboard, copyValue],
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
