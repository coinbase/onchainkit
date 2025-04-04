type OpenPopupProps = {
  url: string;
  height: number;
  width: number;
  target?: string;
};

/**
 * Open a popup in the center of the screen with the specified size.
 */
export function openPopup({ url, target, height, width }: OpenPopupProps) {
  // Center the popup window in the screen
  const left = Math.round((window.screen.width - width) / 2);
  const top = Math.round((window.screen.height - height) / 2);

  const windowFeatures = `width=${width},height=${height},resizable,scrollbars=yes,status=1,left=${left},top=${top}`;
  return window.open(url, target, windowFeatures);
}
