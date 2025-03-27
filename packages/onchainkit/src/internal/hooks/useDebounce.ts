import { useLayoutEffect, useMemo, useRef } from 'react';

export const useDebounce = (
  callback: (...args: any[]) => void,
  delay: number,
) => {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  let timer: number | NodeJS.Timeout;

  const debounce = (
    func: (...args: any[]) => void,
    delayMs: number,
    ...args: any[]
  ) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delayMs);
  };

  return useMemo(() => {
    return (...args: any) => {
      return debounce(callbackRef.current, delay, ...args);
    };
  }, [delay]);
};
