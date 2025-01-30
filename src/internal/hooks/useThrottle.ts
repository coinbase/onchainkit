import { useCallback, useEffect, useRef } from 'react';

type AnyFunction = (...args: unknown[]) => unknown;

/**
 * A hook that returns a throttled version of a callback function.
 * Throttling ensures the callback is executed at most once within the specified delay period.
 *
 * Behavior:
 * 1. First call is always executed immediately
 * 2. Subsequent calls within the delay period are handled as follows:
 *    - If no delayed execution is scheduled, schedules one with the latest arguments
 *    - If a delayed execution is already scheduled, updates it with the latest arguments
 * 3. After the delay period passes, the next call will execute immediately
 *
 * Example timing with 1000ms delay:
 * ```
 * 0ms:   first call → executes immediately
 * 100ms: second call → schedules execution for 1000ms
 * 300ms: third call → ignored (already scheduled)
 * 1000ms: scheduled execution happens
 * 1100ms: fourth call → executes immediately (delay passed)
 * ```
 *
 * @param callback - The function to throttle
 * @param delay - The number of milliseconds to wait before allowing another execution
 *
 * @returns A throttled version of the callback that maintains the same arguments
 * and automatically cleans up any pending executions on unmount
 *
 * @example
 * ```tsx
 * const throttledFetch = useThrottle((value: string) => {
 *   // This will execute immediately once,
 *   // then wait 1000ms before allowing another execution
 *   fetchData(value);
 * }, 1000);
 *
 * // Usage
 * throttledFetch('search'); // executes immediately
 * throttledFetch('se');     // schedules execution
 * throttledFetch('s');      // updates scheduled execution with 's'
 * // After 1000ms: executes with latest value ('s')
 * ```
 */
export const useThrottle = <T extends AnyFunction>(
  callback: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  const lastCallTime = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastArgsRef = useRef<Parameters<T>>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTime.current;

      if (timeSinceLastCall >= delay) {
        // Execute immediately if enough time has passed
        callbackRef.current(...args);
        lastCallTime.current = now;
      } else if (timeoutRef.current) {
        // Update the scheduled execution with the latest arguments
        lastArgsRef.current = args;
      } else if (!timeoutRef.current) {
        // Store args for delayed execution
        lastArgsRef.current = args;
        // Schedule next execution at the end of delay period
        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
            lastCallTime.current = Date.now();
          }
          timeoutRef.current = undefined;
        }, delay - timeSinceLastCall);
      }
    },
    [delay],
  );
};
