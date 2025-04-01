import { useCallback, useEffect } from 'react';

export function useOutsideClick(
  elRef: React.RefObject<HTMLElement>,
  callback: () => void,
) {
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!elRef.current) {
        return;
      }

      const isOutsideClick = !elRef.current.contains(e.target as Node);

      const eventPath = e.composedPath?.();

      const hasPortalOrigin = eventPath?.some(
        (el) =>
          el instanceof HTMLElement && el.hasAttribute('data-portal-origin'),
      );

      // Check if the clicked target is outside of the referenced element
      if (!hasPortalOrigin && isOutsideClick) {
        callback();
      }
    },
    [callback, elRef],
  );

  useEffect(() => {
    // Add click event listener when component mounts
    document.addEventListener('click', handleClickOutside, { capture: true });

    // Cleanup function to remove event listener when component unmounts
    // or when handleClickOutside changes
    return () => {
      document.removeEventListener('click', handleClickOutside, {
        capture: true,
      });
    };
  }, [handleClickOutside]);
}
