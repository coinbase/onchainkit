import {
  getWindowDimensions,
  type popupSizes,
} from '../../internal/utils/getWindowDimensions';
import { ONRAMP_POPUP_HEIGHT, ONRAMP_POPUP_WIDTH } from '../constants';
import { ONRAMP_BUY_URL } from '../constants';

type PopupSize = {
  height: number;
  width: number;
};

/**
 * Gets the appropriate popup dimensions for the given size and funding URL.
 */
export function getFundingPopupSize(
  size: keyof typeof popupSizes,
  fundingUrl?: string,
): PopupSize {
  // The Coinbase Onramp widget is not very responsive, so we need to set a fixed popup size.
  if (fundingUrl?.includes(ONRAMP_BUY_URL)) {
    return {
      height: ONRAMP_POPUP_HEIGHT,
      width: ONRAMP_POPUP_WIDTH,
    };
  }

  return getWindowDimensions(size);
}
