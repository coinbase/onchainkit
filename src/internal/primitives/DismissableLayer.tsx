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
  // Tracks whether the pointer event originated inside the React component tree
  const isPointerInsideReactTreeRef = useRef(false);

  useEffect(() => {
    if (disableOutsideClick && disableEscapeKey) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!disableEscapeKey && event.key === 'Escape') {
        onDismiss?.();
      }
    };

    const shouldDismiss = (target: Node) => {
      return layerRef.current && !layerRef.current.contains(target);
    };

    // Handle clicks outside the layer
    const handlePointerDown = (event: PointerEvent) => {
      // Skip if outside clicks are disabled or if the click started inside the component
      if (disableOutsideClick || isPointerInsideReactTreeRef.current) {
        isPointerInsideReactTreeRef.current = false;
        return;
      }

      // Dismiss if click is outside the layer
      if (shouldDismiss(event.target as Node)) {
        onDismiss?.();
      }
      // Reset the flag after handling the event
      isPointerInsideReactTreeRef.current = false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [disableOutsideClick, disableEscapeKey, onDismiss]);

  return (
    <div
      data-testid="ockDismissableLayer"
      // Set flag when pointer event starts inside the component
      // This prevents dismissal when dragging from inside to outside
      onPointerDownCapture={() => {
        isPointerInsideReactTreeRef.current = true;
      }}
      ref={layerRef}
    >
      {children}
    </div>
  );
}
