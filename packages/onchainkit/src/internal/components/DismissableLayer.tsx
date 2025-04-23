import type React from 'react';
import { useEffect, useRef } from 'react';

type DismissableLayerProps = {
  children?: React.ReactNode;
  disableEscapeKey?: boolean;
  disableOutsideClick?: boolean;
  onDismiss?: () => void;
  /**
   * Reference to the trigger element (e.g., button) that opens this layer.
   * Prevents the layer from being dismissed when the trigger is clicked, enabling proper toggle behavior.
   */
  triggerRef?: React.RefObject<HTMLElement>;
  /**
   * When `true`, prevents trigger click events from bubbling up.
   * Useful for bottom sheets to prevent unwanted side effects.
   */
  preventTriggerEvents?: boolean;
};

/**
 * DismissableLayer handles dismissal using outside clicks and escape key events
 */
export function DismissableLayer({
  children,
  disableEscapeKey = false,
  disableOutsideClick = false,
  onDismiss,
  triggerRef,
  preventTriggerEvents = false,
}: DismissableLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disableOutsideClick && disableEscapeKey) {
      return;
    }

    const handleTriggerClick = (event: PointerEvent) => {
      if (preventTriggerEvents) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const isClickInsideLayer = (target: Node) => {
      return layerRef.current?.contains(target);
    };

    const handlePointerDownCapture = (event: PointerEvent) => {
      if (disableOutsideClick) {
        return;
      }

      if (!(event.target instanceof Node)) {
        return;
      }

      const target = event.target;

      if (triggerRef?.current?.contains(target)) {
        handleTriggerClick(event);
        return;
      }

      if (!isClickInsideLayer(target)) {
        onDismiss?.();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!disableEscapeKey && event.key === 'Escape') {
        onDismiss?.();
      }
    };

    document.addEventListener('pointerdown', handlePointerDownCapture, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener(
        'pointerdown',
        handlePointerDownCapture,
        true,
      );
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    disableOutsideClick,
    disableEscapeKey,
    onDismiss,
    triggerRef,
    preventTriggerEvents,
  ]);

  return (
    <div data-testid="ockDismissableLayer" ref={layerRef}>
      {children}
    </div>
  );
}
