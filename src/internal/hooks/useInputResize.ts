import { type RefObject, useCallback, useEffect } from 'react';

export const useInputResize = (
  containerRef: RefObject<HTMLDivElement>,
  inputRef: RefObject<HTMLInputElement>,
  hiddenSpanRef: RefObject<HTMLSpanElement>,
  currencySpanRef: RefObject<HTMLSpanElement>,
) => {
  const updateInputWidth = useCallback(() => {
    if (hiddenSpanRef.current && inputRef.current && containerRef.current) {
      const textWidth = Math.max(42, hiddenSpanRef.current.offsetWidth);
      const currencyWidth =
        currencySpanRef.current?.getBoundingClientRect().width || 0;
      const containerWidth = containerRef.current.getBoundingClientRect().width;

      // Set the input width based on available space
      inputRef.current.style.width = `${textWidth}px`;
      inputRef.current.style.maxWidth = `${containerWidth - currencyWidth}px`;
    }
  }, [containerRef, inputRef, hiddenSpanRef, currencySpanRef]);

  // Set up resize observer
  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      updateInputWidth();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, updateInputWidth]);

  // Update width when value changes
  return updateInputWidth;
};
