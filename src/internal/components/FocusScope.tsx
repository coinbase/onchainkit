import { useCallback, useEffect, useRef, type ReactNode } from 'react';

interface FocusScopeProps {
  children: ReactNode;
  trapped?: boolean;
  loop?: boolean;
  listbox?: boolean;
}

export function FocusScope({
  children,
  trapped = true,
  loop = true,
  listbox = false,
}: FocusScopeProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  console.log('1 o FOCUS SCOPE!');

  const getFocusableElements = useCallback(() => {
    if (!scopeRef.current) {
      return [];
    }

    return Array.from(
      scopeRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.hasAttribute('disabled'));
  }, []);

  const updateFocusableRefs = useCallback(() => {
    const elements = getFocusableElements();
    firstFocusableRef.current = elements[0];
    lastFocusableRef.current = elements[elements.length - 1];
  }, [getFocusableElements]);

  useEffect(() => {
    updateFocusableRefs();
  }, [updateFocusableRefs]);

  const handleKeyDown = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity:
    (event: KeyboardEvent) => {
      if (!trapped) {
        return;
      }

      updateFocusableRefs();
      const elements = getFocusableElements();
      const currentIndex = elements.indexOf(
        document.activeElement as HTMLElement,
      );

      if (event.key === 'Tab') {
        if (loop) {
          if (
            event.shiftKey &&
            document.activeElement === firstFocusableRef.current
          ) {
            event.preventDefault();
            lastFocusableRef.current?.focus();
          } else if (
            !event.shiftKey &&
            document.activeElement === lastFocusableRef.current
          ) {
            event.preventDefault();
            firstFocusableRef.current?.focus();
          }
        }
      } else if (
        listbox &&
        (event.key === 'ArrowDown' || event.key === 'ArrowUp')
      ) {
        event.preventDefault();

        if (currentIndex === -1) {
          if (event.key === 'ArrowDown') {
            elements[0]?.focus();
          } else {
            elements[elements.length - 1]?.focus();
          }
          return;
        }

        const nextIndex =
          event.key === 'ArrowDown'
            ? (currentIndex + 1) % elements.length
            : (currentIndex - 1 + elements.length) % elements.length;

        elements[nextIndex]?.focus();
      }
    },
    [trapped, loop, listbox, getFocusableElements, updateFocusableRefs],
  );

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || !trapped) {
      return;
    }

    scope.addEventListener('keydown', handleKeyDown);
    return () => scope.removeEventListener('keydown', handleKeyDown);
  }, [trapped, handleKeyDown]);

  return <div ref={scopeRef}>{children}</div>;
}
