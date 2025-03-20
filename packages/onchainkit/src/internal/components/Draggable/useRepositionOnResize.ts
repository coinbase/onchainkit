import { type Dispatch, useCallback, useEffect } from 'react';

export function useRespositionOnWindowResize(
  draggableRef: React.RefObject<HTMLDivElement>,
  position: { x: number; y: number },
  resetPosition: Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >,
) {
  const isElementInViewport = useCallback((rect: DOMRect) => {
    return (
      rect.right <= window.innerWidth &&
      rect.bottom <= window.innerHeight &&
      rect.left >= 0 &&
      rect.top >= 0
    );
  }, []);

  const repositionDraggable = useCallback(
    (rect: DOMRect, currentPosition: { x: number; y: number }) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let newX: number;
      let newY: number;

      if (rect.right > viewportWidth) {
        newX = viewportWidth - rect.width - 10;
      } else if (rect.left < 0) {
        newX = 10;
      } else {
        newX = currentPosition.x;
      }

      if (rect.bottom > viewportHeight) {
        newY = viewportHeight - rect.height - 10;
      } else if (rect.top < 0) {
        newY = 10;
      } else {
        newY = currentPosition.y;
      }

      return { x: newX, y: newY };
    },
    [],
  );

  const handleWindowResize = useCallback(() => {
    if (!draggableRef.current) {
      return;
    }

    const el = draggableRef.current;
    const rect = el.getBoundingClientRect();

    const newPosition = repositionDraggable(rect, position);

    resetPosition((currentPos) =>
      isElementInViewport(rect) ? currentPos : newPosition,
    );
  }, [
    draggableRef,
    position,
    repositionDraggable,
    resetPosition,
    isElementInViewport,
  ]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [handleWindowResize]);
}
