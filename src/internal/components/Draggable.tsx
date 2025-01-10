import { zIndex } from '@/styles/constants';
import { cn } from '@/styles/theme';
import { useCallback, useEffect, useState } from 'react';
import { useIsModalOpen } from '../hooks/useIsModalOpen';

type DraggableProps = {
  children: React.ReactNode;
  gridSize?: number;
  startingPosition?: { x: number; y: number };
  snapToGrid?: boolean;
};

export function Draggable({
  children,
  gridSize = 1,
  startingPosition = { x: 20, y: 20 },
  snapToGrid = false,
}: DraggableProps) {
  const [position, setPosition] = useState(startingPosition);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [cursorDisplay, setCursorDisplay] = useState('default');
  const isModalOpen = useIsModalOpen();

  useEffect(() => {
    if (isModalOpen) {
      setCursorDisplay('default');
      return;
    }

    setCursorDisplay(isDragging ? 'cursor-grabbing' : 'cursor-grab');
  }, [isModalOpen, isDragging]);

  const calculateSnapToGrid = useCallback(
    (positionValue: number) => {
      return Math.round(positionValue / gridSize) * gridSize;
    },
    [gridSize],
  );

  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (isModalOpen) {
        return;
      }

      setIsDragging(true);
      setDragStartPosition({ x: e.clientX, y: e.clientY });
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position, isModalOpen],
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

  return (
    <div
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
