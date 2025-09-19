import { useOnchainKit } from '@/useOnchainKit';
import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
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

  it('should return undefined if projectId is null', () => {
    (useFundContext as Mock).mockReturnValue({
      selectedPaymentMethod: { id: 'FIAT_WALLET' },
      selectedInputType: 'fiat',
      fundAmountFiat: '100',
      fundAmountCrypto: '0',
      asset: 'ETH',
    });

    const { result } = renderHook(() => useFundCardFundingUrl());
    expect(result.current).toBeUndefined();
  });

  it('should return undefined if address is undefined', () => {
    (useFundContext as Mock).mockReturnValue({
      selectedPaymentMethod: { id: 'FIAT_WALLET' },
      selectedInputType: 'fiat',
      fundAmountFiat: '100',
      fundAmountCrypto: '0',
      asset: 'ETH',
    });

    const { result } = renderHook(() => useFundCardFundingUrl());
    expect(result.current).toBeUndefined();
  });

  it('should return valid URL when input type is fiat', () => {
    (useFundContext as Mock).mockReturnValue({
      sessionToken: 'sessionToken',
      selectedPaymentMethod: { id: 'FIAT_WALLET' },
      selectedInputType: 'fiat',
      fundAmountFiat: '100',
      fundAmountCrypto: '0',
      asset: 'ETH',
    });

    const { result } = renderHook(() => useFundCardFundingUrl());
    expect(result.current).toContain('presetFiatAmount=100');
  });

  it('should return valid URL when input type is crypto', () => {
    (useFundContext as Mock).mockReturnValue({
      sessionToken: 'sessionToken',
      selectedPaymentMethod: { id: 'CRYPTO_WALLET' },
      selectedInputType: 'crypto',
      fundAmountFiat: '0',
      fundAmountCrypto: '1.5',
      asset: 'ETH',
    });

    const { result } = renderHook(() => useFundCardFundingUrl());
    expect(result.current).toContain('presetCryptoAmount=1.5');
  });

});
