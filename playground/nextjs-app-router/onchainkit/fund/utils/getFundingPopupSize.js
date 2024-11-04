import { getWindowDimensions } from '../../internal/utils/getWindowDimensions.js';
import { ONRAMP_BUY_URL, ONRAMP_POPUP_HEIGHT, ONRAMP_POPUP_WIDTH } from '../constants.js';

/**
 * Gets the appropriate popup dimensions for the given size and funding URL.
 */
function getFundingPopupSize(size, fundingUrl) {
  // The Coinbase Onramp widget is not very responsive, so we need to set a fixed popup size.
  if (fundingUrl?.includes(ONRAMP_BUY_URL)) {
    return {
      height: ONRAMP_POPUP_HEIGHT,
      width: ONRAMP_POPUP_WIDTH
    };
  }
  return getWindowDimensions(size);
}
export { getFundingPopupSize };
//# sourceMappingURL=getFundingPopupSize.js.map
