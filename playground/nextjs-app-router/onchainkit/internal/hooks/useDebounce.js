import { useRef, useLayoutEffect, useMemo } from 'react';
const useDebounce = (callback, delay) => {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  let timer;
  const debounce = (func, delayMs, ...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delayMs);
  };
  return useMemo(() => {
    return (...args) => {
      return debounce(callbackRef.current, delay, ...args);
    };
  }, [delay]);
};
export { useDebounce };
//# sourceMappingURL=useDebounce.js.map
