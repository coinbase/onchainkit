import { getOnrampBuyUrl } from '@/fund/utils/getOnrampBuyUrl';
import { SwapUnit } from '@/swap/types';
import { Token } from '@/token';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getBuyFundingUrl } from './getBuyFundingUrl';

vi.mock('@/fund/utils/getOnrampBuyUrl', () => ({
  getOnrampBuyUrl: vi.fn(),
}));

describe('getBuyFundingUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns undefined if sessionToken is not provided', () => {
    const result = getBuyFundingUrl({
      to: {
        amount: '1',
        token: { symbol: 'ETH' } as Token,
      } as SwapUnit,
      paymentMethodId: 'pm_001',
    });

    expect(result).toBeUndefined();
    expect(getOnrampBuyUrl).not.toHaveBeenCalled();
  });

  it('returns undefined if fundAmount is missing', () => {
    const result = getBuyFundingUrl({
      to: undefined,
      sessionToken: 'test-session-token',
      paymentMethodId: 'pm_001',
    });

    expect(result).toBeUndefined();
    expect(getOnrampBuyUrl).toHaveBeenCalled();
  });

  it('returns undefined if amount is missing from to', () => {
    const result = getBuyFundingUrl({
      to: {
        token: { symbol: 'ETH' } as Token,
      } as SwapUnit,
      sessionToken: 'test-session-token',
      paymentMethodId: 'pm_001',
    });

    expect(result).toBeUndefined();
    expect(getOnrampBuyUrl).toHaveBeenCalled();
  });

  it('calls getOnrampBuyUrl with correct parameters when sessionToken is provided', () => {
    const mockUrl = 'https://onramp.com/buy';
    (getOnrampBuyUrl as ReturnType<typeof vi.fn>).mockReturnValue(mockUrl);

    const result = getBuyFundingUrl({
      to: {
        amount: '1.5',
        token: { symbol: 'ETH' },
      } as SwapUnit,
      sessionToken: 'test-session-token',
      paymentMethodId: 'pm_001',
    });

    expect(getOnrampBuyUrl).toHaveBeenCalledWith({
      sessionToken: 'test-session-token',
      presetCryptoAmount: 1.5,
      defaultPaymentMethod: 'pm_001',
      originComponentName: 'FundCard',
    });

    expect(result).toBe(mockUrl);
  });

  it('uses correct originComponentName', () => {
    const mockUrl = 'https://onramp.com/buy';
    (getOnrampBuyUrl as ReturnType<typeof vi.fn>).mockReturnValue(mockUrl);

    getBuyFundingUrl({
      to: {
        amount: '2.0',
        token: { symbol: 'USDC' },
      } as SwapUnit,
      sessionToken: 'another-session-token',
      paymentMethodId: 'CARD',
    });

    expect(getOnrampBuyUrl).toHaveBeenCalledWith({
      sessionToken: 'another-session-token',
      presetCryptoAmount: 2.0,
      defaultPaymentMethod: 'CARD',
      originComponentName: 'FundCard',
    });
  });
});
