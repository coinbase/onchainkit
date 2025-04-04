import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { getWindowDimensions } from '../../internal/utils/getWindowDimensions';
import { ONRAMP_POPUP_HEIGHT, ONRAMP_POPUP_WIDTH } from '../constants';
import { getFundingPopupSize } from './getFundingPopupSize';

vi.mock('@/internal/utils/getWindowDimensions', () => ({
  getWindowDimensions: vi.fn(),
}));

describe('getFundingPopupSize', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('returns size based on window dimensions when no fundingUrl is provided', () => {
    (getWindowDimensions as Mock).mockReturnValue({ height: 200, width: 100 });
    const result = getFundingPopupSize('md');
    expect(result).toEqual({ height: 200, width: 100 });
    expect(getWindowDimensions).toHaveBeenCalledWith('md');
  });

  it('returns size based on window dimensions when fundingUrl is not an Onramp fund URL', () => {
    (getWindowDimensions as Mock).mockReturnValue({ height: 200, width: 100 });
    const result = getFundingPopupSize('lg', 'https://fund.url');
    expect(result).toEqual({ height: 200, width: 100 });
    expect(getWindowDimensions).toHaveBeenCalledWith('lg');
  });

  it('returns Onramp Popup size when fundingUrl matches an Onramp fund URL', () => {
    const result = getFundingPopupSize('md', 'https://pay.coinbase.com/buy');
    expect(result).toEqual({
      height: ONRAMP_POPUP_HEIGHT,
      width: ONRAMP_POPUP_WIDTH,
    });
    expect(getWindowDimensions).not.toHaveBeenCalled();
  });
});
