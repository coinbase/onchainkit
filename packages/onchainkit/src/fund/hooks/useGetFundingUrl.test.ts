import { useIsWalletACoinbaseSmartWallet } from '@/wallet/hooks/useIsWalletACoinbaseSmartWallet';
import { renderHook } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { getCoinbaseSmartWalletFundUrl } from '../utils/getCoinbaseSmartWalletFundUrl';
import { getOnrampBuyUrl } from '../utils/getOnrampBuyUrl';
import { useGetFundingUrl } from './useGetFundingUrl';

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/wallet/hooks/useIsWalletACoinbaseSmartWallet', () => ({
  useIsWalletACoinbaseSmartWallet: vi.fn(),
}));

vi.mock('@/fund/utils/getCoinbaseSmartWalletFundUrl', () => ({
  getCoinbaseSmartWalletFundUrl: vi.fn(),
}));

vi.mock('@/fund/utils/getOnrampBuyUrl', () => ({
  getOnrampBuyUrl: vi.fn(),
}));

describe('useGetFundingUrl', () => {
  it('should return a Coinbase Smart Wallet fund URL if connected wallet is a Coinbase Smart Wallet', () => {
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(true);
    (getCoinbaseSmartWalletFundUrl as Mock).mockReturnValue(
      'https://keys.coinbase.com/fund',
    );

    const { result } = renderHook(() => useGetFundingUrl({}));

    expect(result.current).toBe('https://keys.coinbase.com/fund');
  });

  it('should return a Coinbase Onramp fund URL if connected wallet is not a Coinbase Smart Wallet', () => {
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);
    (getOnrampBuyUrl as Mock).mockReturnValue('https://pay.coinbase.com/buy');

    const { result } = renderHook(() =>
      useGetFundingUrl({ sessionToken: 'sessionToken' }),
    );

    expect(result.current).toBe('https://pay.coinbase.com/buy');

    expect(getOnrampBuyUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        sessionToken: 'sessionToken',
      }),
    );
  });

  it('should return undefined if connected wallet is not a Coinbase Smart Wallet and projectId is undefined', () => {
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);

    const { result } = renderHook(() => useGetFundingUrl({}));

    expect(result.current).toBeUndefined();
  });

  it('should return undefined if connected wallet is not a Coinbase Smart Wallet and address is undefined', () => {
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);

    const { result } = renderHook(() => useGetFundingUrl({}));

    expect(result.current).toBeUndefined();
  });

  it('should prioritize sessionToken when provided', () => {
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);
    (getOnrampBuyUrl as Mock).mockReturnValue('https://pay.coinbase.com/buy');

    const sessionToken = 'test-session-token';
    const fiatCurrency = 'EUR';
    const originComponentName = 'TestComponent';

    const { result } = renderHook(() =>
      useGetFundingUrl({ sessionToken, fiatCurrency, originComponentName }),
    );

    expect(result.current).toBe('https://pay.coinbase.com/buy');
    expect(getOnrampBuyUrl).toHaveBeenCalledWith({
      sessionToken,
      fiatCurrency,
      originComponentName,
    });
    expect(getOnrampBuyUrl).not.toHaveBeenCalledWith(
      expect.objectContaining({ projectId: 'projectId' }),
    );
  });

  it('should use sessionToken over projectId when both are available', () => {
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);
    (getOnrampBuyUrl as Mock).mockReturnValue('https://pay.coinbase.com/buy');

    const sessionToken = 'test-session-token';

    const { result } = renderHook(() => useGetFundingUrl({ sessionToken }));

    expect(result.current).toBe('https://pay.coinbase.com/buy');
    expect(getOnrampBuyUrl).toHaveBeenCalledWith({
      sessionToken,
      fiatCurrency: undefined,
      originComponentName: undefined,
    });
  });
});
