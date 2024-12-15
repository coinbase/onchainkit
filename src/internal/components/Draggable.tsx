import { useCallback, useEffect, useState } from 'react';
import { cn } from '../../styles/theme';

type DraggableProps = {
  children: React.ReactNode;
  gridSize?: number;
  startingPosition?: { x: number; y: number };
  enableSnapToGrid?: boolean;
};

export default function Draggable({
  children,
  gridSize = 1,
  startingPosition = { x: 20, y: 20 },
  enableSnapToGrid = true,
}: DraggableProps) {
  const [position, setPosition] = useState(startingPosition);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const snapToGrid = useCallback(
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
        x: enableSnapToGrid ? snapToGrid(prev.x) : prev.x,
        y: enableSnapToGrid ? snapToGrid(prev.y) : prev.y,
      }));
      setIsDragging(false);
    };

    document.addEventListener('pointermove', handleGlobalMove);
    document.addEventListener('pointerup', handleGlobalEnd);

    return () => {
      document.removeEventListener('pointermove', handleGlobalMove);
      document.removeEventListener('pointerup', handleGlobalEnd);
    };
  }, [isDragging, dragOffset, snapToGrid, enableSnapToGrid]);

  return (
    <div
      data-testid="ockDraggable"
      className={cn(
        'fixed select-none',
        isDragging ? 'cursor-grabbing' : 'cursor-grab',
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        touchAction: 'none',
      }}
      onPointerDown={handleDragStart}
    >
      {children}
    </div>
  );
}
