import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useFundContext } from '../components/FundCardProvider';
import { useFundCardFundingUrl } from './useFundCardFundingUrl';

vi.mock('../components/FundCardProvider', () => ({
  useFundContext: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

describe('useFundCardFundingUrl', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  // With sessionToken required in FundCard flow, the URL is always constructed with it
  // These tests assert the URL contains sessionToken and correct amount param

  it('should return valid URL with sessionToken when input type is fiat', () => {
    (useFundContext as Mock).mockReturnValue({
      sessionToken: 'sessionToken',
      selectedPaymentMethod: { id: 'FIAT_WALLET' },
      selectedInputType: 'fiat',
      fundAmountFiat: '100',
      fundAmountCrypto: '0',
      asset: 'ETH',
      currency: 'USD',
    });

    const { result } = renderHook(() => useFundCardFundingUrl());
    expect(result.current).toContain('sessionToken=sessionToken');
    expect(result.current).toContain('presetFiatAmount=100');
  });

  it('should return valid URL with sessionToken when input type is crypto', () => {
    (useFundContext as Mock).mockReturnValue({
      sessionToken: 'sessionToken',
      selectedPaymentMethod: { id: 'CRYPTO_WALLET' },
      selectedInputType: 'crypto',
      fundAmountFiat: '0',
      fundAmountCrypto: '1.5',
      asset: 'ETH',
      currency: 'USD',
    });

    const { result } = renderHook(() => useFundCardFundingUrl());
    expect(result.current).toContain('sessionToken=sessionToken');
    expect(result.current).toContain('presetCryptoAmount=1.5');
  });
});
