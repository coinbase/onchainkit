import { type Dispatch, useCallback, useEffect, useRef } from 'react';

export function useBoundedPosition(
  draggableRef: React.RefObject<HTMLDivElement>,
  position: { x: number; y: number },
  resetPosition: Dispatch<React.SetStateAction<{ x: number; y: number }>>,
) {
  if (typeof window === 'undefined') {
    return;
  }

  const repositionDraggable = useCallback(
    (rect: DOMRect, currentPosition: { x: number; y: number }) => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const newX = Math.min(
        Math.max(10, currentPosition.x),
        viewportWidth - rect.width - 10,
      );
      const newY = Math.min(
        Math.max(10, currentPosition.y),
        viewportHeight - rect.height - 10,
      );

      return { x: newX, y: newY };
    },
    [],
  );

  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  useEffect(() => {
    if (!draggableRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const rect = draggableRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }

      const newPosition = repositionDraggable(rect, position);
      if (newPosition.x !== position.x || newPosition.y !== position.y) {
        resetPosition(newPosition);
      }
    }, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [position, draggableRef, repositionDraggable, resetPosition]);

  const handleWindowResize = useCallback(() => {
    if (!draggableRef.current) {
      return;
    }

    const rect = draggableRef.current.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const newPosition = repositionDraggable(rect, position);
    resetPosition(newPosition);
  }, [draggableRef, position, repositionDraggable, resetPosition]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [handleWindowResize]);
}
