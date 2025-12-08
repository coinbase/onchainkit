'use client';

type CopyToClipboardParams = {
  copyValue: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export async function copyToClipboard({
  copyValue,
  onSuccess,
  onError,
}: CopyToClipboardParams) {
  try {
    await navigator.clipboard.writeText(copyValue);
    onSuccess?.();
  } catch (err) {
    onError?.(err);
  }
}
