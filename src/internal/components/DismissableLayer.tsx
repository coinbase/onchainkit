import { useEffect, useRef, type ReactNode } from 'react';

interface DismissableLayerProps {
  children: ReactNode;
  onDismiss: () => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

export function DismissableLayer({
  children,
  onDismiss,
  onEscapeKeyDown,
  buttonRef,
}: DismissableLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const isPointerDownInsideRef = useRef(false);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const isInside = layerRef.current?.contains(target);
      const isButton = buttonRef?.current?.contains(target);

      isPointerDownInsideRef.current = isInside || !!isButton;
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInside = layerRef.current?.contains(target);
      const isButton = buttonRef?.current?.contains(target);

      // Only dismiss if the click started and ended outside
      if (!isPointerDownInsideRef.current && !isInside && !isButton) {
        onDismiss();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('click', handleClick);
    };
  }, [onDismiss, buttonRef]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscapeKeyDown?.(event);
        if (!event.defaultPrevented) {
          event.preventDefault();
          onDismiss();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss, onEscapeKeyDown]);

  return <div ref={layerRef}>{children}</div>;
}
