import { useCallback, useEffect } from 'react';

export function useClickOutside(
  elRef: React.RefObject<HTMLElement>,
  callback: () => void,
) {
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!elRef.current) {
        return;
      }

      if (!elRef.current.contains(e.target as Node)) {
        callback();
      }
    },
    [callback, elRef],
  );

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, { capture: true });

    return () => {
      document.removeEventListener('click', handleClickOutside, {
        capture: true,
      });
    };
  }, [handleClickOutside]);
}
