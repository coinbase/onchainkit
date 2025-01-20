"use client";

type CopyToClipboardParams = {
  text: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export async function copyToClipboard({
  text,
  onSuccess,
  onError,
}: CopyToClipboardParams) {
  try {
    await navigator.clipboard.writeText(text);
    onSuccess?.();
  } catch (err) {
    onError?.(err);
  }
};
