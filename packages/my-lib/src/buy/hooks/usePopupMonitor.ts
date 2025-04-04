import { useCallback, useEffect, useRef } from 'react';

export const usePopupMonitor = (onClose?: () => void) => {
  const intervalRef = useRef<number | null>(null);

  // Start monitoring the popup
  const startPopupMonitor = useCallback(
    (popupWindow: Window) => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = window.setInterval(() => {
        if (popupWindow.closed) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onClose?.();
        }
      }, 500);
    },
    [onClose],
  );

  // Stop monitoring the popup
  const stopPopupMonitor = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => stopPopupMonitor();
  }, [stopPopupMonitor]);

  return { startPopupMonitor, stopPopupMonitor };
};
