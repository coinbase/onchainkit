import { zIndex } from '@/styles/constants';
import { cn } from '@/styles/theme';
import { useCallback, useEffect, useState } from 'react';

type DraggableProps = {
  children: React.ReactNode;
  gridSize?: number;
  startingPosition?: { x: number; y: number };
  snapToGrid?: boolean;
};

export default function Draggable({
  children,
  gridSize = 1,
  startingPosition = { x: 20, y: 20 },
  snapToGrid = false,
}: DraggableProps) {
  const [position, setPosition] = useState(startingPosition);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const calculateSnapToGrid = useCallback(
    (positionValue: number) => {
      return Math.round(positionValue / gridSize) * gridSize;
    },
    [gridSize],
  );

  const handleDragStart = (e: React.PointerEvent) => {
    setIsDragging(true);

    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

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

    const handleGlobalEnd = () => {
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
  }, [isDragging, dragOffset, snapToGrid, calculateSnapToGrid]);

  return (
    <div
      data-testid="ockDraggable"
      className={cn(
        'fixed touch-none select-none',
        zIndex.modal,
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
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
