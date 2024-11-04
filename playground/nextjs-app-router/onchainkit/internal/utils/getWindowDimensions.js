const popupSizes = {
  sm: {
    width: '24.67vw',
    height: '30.83vw'
  },
  md: {
    width: '29vw',
    height: '36.25vw'
  },
  lg: {
    width: '35vw',
    height: '43.75vw'
  }
};
const getWindowDimensions = size => {
  const _popupSizes$size = popupSizes[size],
    width = _popupSizes$size.width,
    height = _popupSizes$size.height;

  // Define minimum sizes (in pixels)
  const minWidth = 280;
  const minHeight = 350;

  // Convert viewport units to pixels
  const vwToPx = vw => vw / 100 * window.innerWidth;
  const widthPx = Math.max(minWidth, Math.round(vwToPx(Number.parseFloat(width))));
  const heightPx = Math.max(minHeight, Math.round(vwToPx(Number.parseFloat(height))));

  // Ensure the width and height don't exceed 90% of the viewport dimensions
  const maxWidth = Math.round(window.innerWidth * 0.9);
  const maxHeight = Math.round(window.innerHeight * 0.9);
  const adjustedWidthPx = Math.min(widthPx, maxWidth);
  const adjustedHeightPx = Math.min(heightPx, maxHeight);
  return {
    width: adjustedWidthPx,
    height: adjustedHeightPx
  };
};
export { getWindowDimensions, popupSizes };
//# sourceMappingURL=getWindowDimensions.js.map
