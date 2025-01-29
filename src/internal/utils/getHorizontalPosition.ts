type Alignment = 'start' | 'center' | 'end';

type getHorizontalPositionReact = {
  align: Alignment;
  contentRect: DOMRect | undefined;
  triggerRect: DOMRect | undefined;
};

/**
 * Calculates the horizontal position of content relative to a trigger element
 */
export function getHorizontalPosition({
  align,
  contentRect,
  triggerRect,
}: getHorizontalPositionReact): number {
  // Return a default position (0) if rects are undefined
  if (!triggerRect || !contentRect) {
    return 0;
  }

  switch (align) {
    case 'start':
      return triggerRect.left;
    case 'center': {
      // Handle zero-width trigger case
      if (triggerRect.width === 0) {
        return triggerRect.left - contentRect.width / 2;
      }
      return triggerRect.left + (triggerRect.width - contentRect.width) / 2;
    }
    case 'end': {
      // Handle zero-width content case
      if (contentRect.width === 0) {
        return triggerRect.right;
      }
      return triggerRect.right - contentRect.width;
    }
  }
}
