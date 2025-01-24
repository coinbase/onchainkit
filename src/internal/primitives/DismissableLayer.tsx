import type React from 'react';
import { useEffect, useRef } from 'react';

type DismissableLayerProps = {
  children?: React.ReactNode;
  disableEscapeKey?: boolean;
  disableOutsideClick?: boolean;
  onDismiss?: () => void;
};

// DismissableLayer handles dismissal using outside clicks and escape key events
export function DismissableLayer({
  children,
  disableEscapeKey = false,
  disableOutsideClick = false,
  onDismiss,
}: DismissableLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableOutsideClick && disableEscapeKey) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!disableEscapeKey && event.key === 'Escape') {
        onDismiss?.();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (disableOutsideClick) {
        return;
      }

      // If the click is inside the dismissable layer content, don't dismiss
      // This prevents the popover from closing when clicking inside it
      if (layerRef.current?.contains(event.target as Node)) {
        return;
      }

      // Handling for the trigger button (e.g., settings toggle)
      // Without this, clicking the trigger would cause both:
      // 1. The button's onClick to fire (toggling isOpen)
      // 2. This dismissal logic to fire (forcing close)
      // This would create a race condition where the popover rapidly closes and reopens
      const isTriggerClick = (event.target as HTMLElement).closest(
        '[aria-label="Toggle swap settings"]',
      );
      if (isTriggerClick) {
        return;
      }

      onDismiss?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [disableOutsideClick, disableEscapeKey, onDismiss]);

  return (
    <div data-testid="ockDismissableLayer" ref={layerRef}>
      {children}
    </div>
  );
}
