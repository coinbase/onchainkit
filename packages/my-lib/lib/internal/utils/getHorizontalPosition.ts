type Alignment = 'start' | 'center' | 'end';

type getHorizontalPositionReact = {
  align: Alignment;
  contentRect: DOMRect | undefined;
  triggerRect: DOMRect | undefined;
};

/**
 * Calculates the horizontal position of content relative to a trigger element.
 */
export function getHorizontalPosition({
  align,
  contentRect,
  triggerRect,
}: getHorizontalPositionReact): number {
  if (!triggerRect || !contentRect) {
    return 0;
  }

  switch (align) {
    case 'start':
      return triggerRect.left;
    case 'center':
      return triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    case 'end':
      return triggerRect.right - contentRect.width;
  }
}
