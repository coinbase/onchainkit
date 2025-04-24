type GetBoundedPositionParams = {
  draggableRef: React.RefObject<HTMLDivElement>;
  position: { x: number; y: number };
  minGapToEdge?: number;
};

export function getBoundedPosition({
  draggableRef,
  position,
  minGapToEdge = 10,
}: GetBoundedPositionParams) {
  const rect = draggableRef.current?.getBoundingClientRect();

  if (!rect || typeof window === 'undefined') {
    return position;
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const newX = Math.min(
    Math.max(minGapToEdge, position.x),
    viewportWidth - rect.width - minGapToEdge,
  );
  const newY = Math.min(
    Math.max(minGapToEdge, position.y),
    viewportHeight - rect.height - minGapToEdge,
  );

  return { x: newX, y: newY };
}
