import { useCallback, useEffect, useState } from 'react';
import { cn } from '../../styles/theme';

type DraggableProps = {
  children: React.ReactNode;
  gridSize?: number;
  startingPosition?: { x: number; y: number }; // TODO [BOE-886]: make this based on the parent component's position
};

export default function Draggable({
  children,
  gridSize = 1,
  startingPosition = { x: 20, y: 20 },
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

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      setPosition({
        x: clientX - dragOffset.x,
        y: clientY - dragOffset.y,
      });
    };

    const handleGlobalEnd = () => {
      setPosition((prev) => ({
        x: snapToGrid(prev.x),
        y: snapToGrid(prev.y),
      }));
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleGlobalMove);
    document.addEventListener('touchmove', handleGlobalMove);
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchend', handleGlobalEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, dragOffset, snapToGrid]);

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
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {children}
    </div>
  );
}
