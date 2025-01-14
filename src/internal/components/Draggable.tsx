'use client';

import { zIndex } from '@/styles/constants';
import { cn } from '@/styles/theme';
import { type Dispatch, useCallback, useEffect, useRef, useState } from 'react';

type DraggableProps = {
  children: React.ReactNode;
  gridSize?: number;
  startingPosition?: { x: number; y: number };
  snapToGrid?: boolean;
  draggingDisabled?: boolean;
};

export function Draggable({
  children,
  gridSize = 1,
  startingPosition = { x: 20, y: 20 },
  snapToGrid = false,
  draggingDisabled = false,
}: DraggableProps) {
  const [position, setPosition] = useState(startingPosition);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cursorDisplay, setCursorDisplay] = useState('default');
  const draggableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (draggingDisabled) {
      setCursorDisplay('default');
      return;
    }

    setCursorDisplay(isDragging ? 'cursor-grabbing' : 'cursor-grab');
  }, [draggingDisabled, isDragging]);

  const calculateSnapToGrid = useCallback(
    (positionValue: number) => {
      return Math.round(positionValue / gridSize) * gridSize;
    },
    [gridSize],
  );

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (draggingDisabled) {
        return;
      }

      setIsDragging(true);
      setDragStartPosition({ x: e.clientX, y: e.clientY });
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position, draggingDisabled],
  );

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleGlobalMove = (e: PointerEvent) => {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const handleGlobalEnd = (e: PointerEvent) => {
      const moveDistance = Math.hypot(
        e.clientX - dragStartPosition.x,
        e.clientY - dragStartPosition.y,
      );

      if (moveDistance > 2) {
        e.preventDefault();
        e.stopPropagation();
        const clickEvent = (e2: MouseEvent) => {
          e2.preventDefault();
          e2.stopPropagation();
          document.removeEventListener('click', clickEvent, true);
        };
        document.addEventListener('click', clickEvent, true);
      }

      setPosition((prev) => ({
        x: snapToGrid ? calculateSnapToGrid(prev.x) : prev.x,
        y: snapToGrid ? calculateSnapToGrid(prev.y) : prev.y,
      }));
      setIsDragging(false);
    };

    document.addEventListener('pointermove', handleGlobalMove);
    document.addEventListener('pointerup', handleGlobalEnd);

    return () => {
      document.removeEventListener('pointermove', handleGlobalMove);
      document.removeEventListener('pointerup', handleGlobalEnd);
    };
  }, [
    isDragging,
    dragOffset,
    snapToGrid,
    calculateSnapToGrid,
    dragStartPosition,
  ]);

  useRespositionOnWindowResize(draggableRef, position, setPosition);

  return (
    <div
      ref={draggableRef}
      data-testid="ockDraggable"
      className={cn(
        'fixed touch-none select-none',
        zIndex.modal,
        cursorDisplay,
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onPointerDown={handleDragStart}
    >
      {children}
    </div>
  );
}

function useRespositionOnWindowResize(
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
