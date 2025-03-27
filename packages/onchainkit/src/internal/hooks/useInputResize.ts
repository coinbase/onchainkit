import { type RefObject, useCallback, useEffect } from 'react';

type InputResizeConfig = {
  // Font size in rem units
  baseFontSize: number;
  minScale: number;
};

const defaultConfig: InputResizeConfig = {
  baseFontSize: 3.75, // 60px = 3.75rem at default browser font size
  minScale: 0.01,
};

export function useInputResize(
  containerRef: RefObject<HTMLDivElement>,
  wrapperRef: RefObject<HTMLDivElement>,
  inputRef: RefObject<HTMLInputElement>,
  measureRef: RefObject<HTMLSpanElement>,
  labelRef: RefObject<HTMLSpanElement>,
  config: Partial<InputResizeConfig> = {},
) {
  const { baseFontSize, minScale } = {
    ...defaultConfig,
    ...config,
  };

  const updateScale = useCallback(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    const input = inputRef.current;
    const measure = measureRef.current;
    const label = labelRef.current;

    if (!container || !wrapper || !input || !measure || !label) {
      return;
    }

    // Set base font size in rem units
    measure.style.fontSize = `${baseFontSize}rem`;
    input.style.fontSize = `${baseFontSize}rem`;

    // Get natural content width
    const contentWidth = measure.clientWidth;
    const availableWidth = container.clientWidth - label.clientWidth;

    // Set input width to match content
    input.style.width = `${contentWidth}px`;

    if (contentWidth > availableWidth) {
      const scale = availableWidth / contentWidth;
      const finalScale = Math.max(scale, minScale);

      // Apply scale to wrapper instead of input
      wrapper.style.transform = `scale(${finalScale})`;
      wrapper.style.transformOrigin = 'left center';
    } else {
      wrapper.style.transform = 'scale(1)';
    }
  }, [
    baseFontSize,
    minScale,
    containerRef,
    wrapperRef,
    inputRef,
    measureRef,
    labelRef,
  ]);

  // Update on resize and font size change
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const resizeObserver = new ResizeObserver(updateScale);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, updateScale]);

  return updateScale;
}
