import { copyToClipboard } from '@/core/utils/copyToClipboard';

type CopyButtonProps = {
  label: string;
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
