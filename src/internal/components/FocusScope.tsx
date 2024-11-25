import { useCallback, useEffect, useRef } from 'react';

interface FocusScopeProps {
  children: React.ReactNode;
  contain?: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
}

export function FocusScope({
  children,
  contain = false,
  restoreFocus = false,
  autoFocus = false,
}: FocusScopeProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  console.log('RUNNING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

  useEffect(() => {
    if (restoreFocus) {
      previousFocusRef.current = document.activeElement;
    }

    if (autoFocus) {
      const tabbable = getTabbableElements(scopeRef.current);
      if (tabbable.length) {
        tabbable[0].focus();
      }
    }

    return () => {
      if (restoreFocus && previousFocusRef.current instanceof HTMLElement) {
        previousFocusRef.current.focus();
      }
    };
  }, [restoreFocus, autoFocus]);

  const handleKeyDown = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
    (event: React.KeyboardEvent) => {
      if (!contain || event.key !== 'Tab') {
        return;
      }

      const tabbable = getTabbableElements(scopeRef.current);
      if (!tabbable.length) {
        return;
      }

      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [contain],
  );

  return (
    <div ref={scopeRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}

function getTabbableElements(element: HTMLElement | null): HTMLElement[] {
  if (!element) {
    return [];
  }

  return Array.from(
    element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => {
    const elem = el as HTMLElement;
    return (
      !elem.hasAttribute('disabled') &&
      !elem.getAttribute('aria-hidden') &&
      elem.style.display !== 'none' &&
      elem.style.visibility !== 'hidden'
    );
  }) as HTMLElement[];
}
