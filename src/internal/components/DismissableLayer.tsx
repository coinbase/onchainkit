import { useEffect, useRef } from 'react';

interface DismissableLayerProps {
  children: React.ReactNode;
  onDismiss: () => void;
  disableOutsidePointerEvents?: boolean;
}

export function DismissableLayer({
  children,
  onDismiss,
  disableOutsidePointerEvents = false,
}: DismissableLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const originalBodyPointerEvents = useRef<string>();

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!layerRef.current?.contains(e.target as Node)) {
        onDismiss();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onDismiss();
      }
    };

    // Handle outside clicks
    document.addEventListener('pointerdown', handlePointerDown);
    // Handle escape key
    document.addEventListener('keydown', handleKeyDown);

    if (disableOutsidePointerEvents) {
      originalBodyPointerEvents.current = document.body.style.pointerEvents;
      document.body.style.pointerEvents = 'none';
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);

      if (disableOutsidePointerEvents) {
        document.body.style.pointerEvents =
          originalBodyPointerEvents.current ?? '';
      }
    };
  }, [onDismiss, disableOutsidePointerEvents]);

  return (
    <div
      ref={layerRef}
      style={{
        pointerEvents: disableOutsidePointerEvents ? 'auto' : undefined,
      }}
    >
      {children}
    </div>
  );
}
