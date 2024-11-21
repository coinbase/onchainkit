import { useState } from 'react';
import { cn } from '../../styles/theme';

type DraggableProps = {
  children: React.ReactNode;
  gridSize: number;
  startingPosition?: { x: number; y: number };
};

export default function Draggable({
  children,
  gridSize = 25,
  startingPosition = {
    x: typeof window !== 'undefined' ? window.innerWidth - 460 : 0,
    y: 20,
  },
}: DraggableProps) {
  const [position, setPosition] = useState(startingPosition);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const snapToGrid = (positionValue: number) => {
    return Math.round(positionValue / gridSize) * gridSize;
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!(e.target instanceof HTMLElement)) return;
    setIsDragging(true);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = e.target.getBoundingClientRect();

    setDragOffset({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setPosition({
      x: clientX - dragOffset.x,
      y: clientY - dragOffset.y,
    });
  };

  const handleDragEnd = () => {
    setPosition((prev) => ({
      x: snapToGrid(prev.x),
      y: snapToGrid(prev.y),
    }));

    setIsDragging(false);
  };

  return (
    <div
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
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseUp={handleDragEnd}
      onTouchEnd={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchCancel={handleDragEnd}
    >
      {children}
    </div>
  );
}
