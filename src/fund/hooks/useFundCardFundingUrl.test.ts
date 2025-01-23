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
    (useOnchainKit as Mock).mockReturnValue({
      projectId: null,
      chain: { name: 'base' },
    });

    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: { name: 'base' },
    });

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
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'project123',
      chain: { name: 'base' },
    });

    (useAccount as Mock).mockReturnValue({
      address: undefined,
      chain: { name: 'base' },
    });

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
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'project123',
      chain: { name: 'base' },
    });

    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: { name: 'base' },
    });

    (useFundContext as Mock).mockReturnValue({
      selectedPaymentMethod: { id: 'FIAT_WALLET' },
      selectedInputType: 'fiat',
      fundAmountFiat: '100',
      fundAmountCrypto: '0',
      asset: 'ETH',
    });

    const { result } = renderHook(() => useFundCardFundingUrl());
    expect(result.current).toContain('appId=project123');
    expect(result.current).toContain('presetFiatAmount=100');
  });

  it('should return valid URL when input type is crypto', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'project123',
      chain: { name: 'base' },
    });

    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: { name: 'base' },
    });

    (useFundContext as Mock).mockReturnValue({
      selectedPaymentMethod: { id: 'CRYPTO_WALLET' },
      selectedInputType: 'crypto',
      fundAmountFiat: '0',
      fundAmountCrypto: '1.5',
      asset: 'ETH',
    });

    const { result } = renderHook(() => useFundCardFundingUrl());
    expect(result.current).toContain('appId=project123');
    expect(result.current).toContain('presetCryptoAmount=1.5');
  });

  it('should use defaultChain when accountChain is undefined', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'project123',
      chain: { name: 'base' },
    });

    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: undefined,
    });

    (useFundContext as Mock).mockReturnValue({
      selectedPaymentMethod: { id: 'FIAT_WALLET' },
      selectedInputType: 'fiat',
      fundAmountFiat: '100',
      fundAmountCrypto: '0',
      asset: 'ETH',
    });

    const { result } = renderHook(() => useFundCardFundingUrl());
    expect(result.current).toContain(encodeURI('0x123'));
  });
});
