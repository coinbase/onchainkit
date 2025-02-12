import { useEffect, useState } from 'react';

/**
 * Internal
 * A hook that returns a value that automatically resets after a specified duration
 *
 * @param initialValue - The initial value
 * @param durationMs - Duration in milliseconds before the value resets
 * @returns [value, setValue] - Current value and setter function
 */
export function useTemporaryValue<T>(
  initialValue: T,
  durationMs: number,
): [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (value !== initialValue) {
      timer = setTimeout(() => {
        setValue(initialValue);
      }, durationMs);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [value, initialValue, durationMs]);

  return [value, setValue];
}
