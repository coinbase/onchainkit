import { useCallback, useEffect, useRef } from 'react';
import { copyToClipboard } from '../utils/copyToClipboard';

type UseCopyToClipboardParams = {
  resetDelay?: number;
  onSuccess?: () => void;
  onReset?: () => void;
  onError?: (error: unknown) => void;
};

export function useCopyToClipboard({
  resetDelay = 2000,
  onSuccess,
  onError,
  onReset,
}: UseCopyToClipboardParams = {}) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    onReset?.();
  }, [onReset]);

  const copy = useCallback(
    async (text: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      await copyToClipboard({
        copyValue: text,
        onSuccess: () => {
          onSuccess?.();
          timeoutRef.current = setTimeout(reset, resetDelay);
        },
        onError: (error) => {
          onError?.(error);
          timeoutRef.current = setTimeout(reset, resetDelay);
        },
      });
    },
    [onSuccess, reset, resetDelay, onError],
  );

  return copy;
}
