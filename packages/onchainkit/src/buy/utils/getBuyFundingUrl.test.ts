import { getOnrampBuyUrl } from '@/fund/utils/getOnrampBuyUrl';
import { SwapUnit } from '@/swap/types';
import { Token } from '@/token';
import type { Chain } from 'viem';
import { base } from 'viem/chains';
import { describe, it, expect, vi } from 'vitest';
import { getBuyFundingUrl } from './getBuyFundingUrl';

vi.mock('@/fund/utils/getOnrampBuyUrl', () => ({
  getOnrampBuyUrl: vi.fn(),
}));

describe('getBuyFundingUrl', () => {
  const baseParams = {
    projectId: 'abc123',
    address: '0x123',
    paymentMethodId: 'pm_001',
    chain: base as Chain,
  };

  it('returns undefined if projectId is null', () => {
    const result = getBuyFundingUrl({
      ...baseParams,
      projectId: null,
      to: {
        amount: '1',
        token: { symbol: 'ETH' } as Token,
      } as SwapUnit,
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined if address is undefined', () => {
    const result = getBuyFundingUrl({
      ...baseParams,
      address: undefined,
      to: {
        amount: '1',
        token: { symbol: 'ETH' },
      } as SwapUnit,
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined if assetSymbol is missing', () => {
    const result = getBuyFundingUrl({
      ...baseParams,
      to: {
        amount: '1',
        token: undefined,
      } as SwapUnit,
    });

    expect(result).toBeUndefined();
  });

  it('calls getOnrampBuyUrl with correct parameters', () => {
    const mockUrl = 'https://onramp.com/buy';
    (getOnrampBuyUrl as ReturnType<typeof vi.fn>).mockReturnValue(mockUrl);

    const result = getBuyFundingUrl({
      ...baseParams,
      to: {
        amount: '1.5',
        token: { symbol: 'ETH' },
      } as SwapUnit,
    });

    expect(getOnrampBuyUrl).toHaveBeenCalledWith({
      projectId: 'abc123',
      assets: ['ETH'],
      presetCryptoAmount: 1.5,
      defaultPaymentMethod: 'pm_001',
      addresses: {
        '0x123': ['base'],
      },
      originComponentName: 'FundCard',
    });

    expect(result).toBe(mockUrl);
  });
});
