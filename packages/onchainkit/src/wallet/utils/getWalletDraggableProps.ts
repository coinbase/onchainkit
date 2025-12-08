import { getDefaultDraggableStartingPosition } from './getDefaultDraggableStartingPosition';

export function getWalletDraggableProps({
  draggable,
  draggableStartingPosition,
}: {
  draggable?: boolean;
  draggableStartingPosition?: { x: number; y: number };
}) {
  if (!draggable) {
    return { draggable };
  }

  return {
    draggable,
    draggableStartingPosition:
      draggableStartingPosition ?? getDefaultDraggableStartingPosition(),
  };
}
