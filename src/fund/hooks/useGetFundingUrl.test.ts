import { useOnchainKit } from '@/useOnchainKit';
import { useIsWalletACoinbaseSmartWallet } from '@/wallet/hooks/useIsWalletACoinbaseSmartWallet';
import { renderHook } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
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
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'projectId',
      chain: { name: 'onchainkitchain' },
    });
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: { name: 'accountchain' },
    });
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(true);
    (getCoinbaseSmartWalletFundUrl as Mock).mockReturnValue(
      'https://keys.coinbase.com/fund',
    );

    const { result } = renderHook(() => useGetFundingUrl({}));

    expect(result.current).toBe('https://keys.coinbase.com/fund');
  });

  it('should return a Coinbase Onramp fund URL if connected wallet is not a Coinbase Smart Wallet', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'projectId',
      chain: { name: 'onchainkitchain' },
    });
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: { name: 'accountchain' },
    });
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);
    (getOnrampBuyUrl as Mock).mockReturnValue('https://pay.coinbase.com/buy');

    const { result } = renderHook(() => useGetFundingUrl({}));

    expect(result.current).toBe('https://pay.coinbase.com/buy');

    expect(getOnrampBuyUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'projectId',
        addresses: { '0x123': ['accountchain'] },
      }),
    );
  });

  it('should fall back to the onchainkit config chain if account chain is undefined', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'projectId',
      chain: { name: 'onchainkitchain' },
    });
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: undefined,
    });
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);
    (getOnrampBuyUrl as Mock).mockReturnValue('https://pay.coinbase.com/buy');

    const { result } = renderHook(() => useGetFundingUrl({}));

    expect(result.current).toBe('https://pay.coinbase.com/buy');

    expect(getOnrampBuyUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        projectId: 'projectId',
        addresses: { '0x123': ['onchainkitchain'] },
      }),
    );
  });

  it('should return undefined if connected wallet is not a Coinbase Smart Wallet and projectId is undefined', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: null,
      chain: { name: 'onchainkitchain' },
    });
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chain: { name: 'accountchain' },
    });
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);

    const { result } = renderHook(() => useGetFundingUrl({}));

    expect(result.current).toBeUndefined();
  });

  it('should return undefined if connected wallet is not a Coinbase Smart Wallet and address is undefined', () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'projectId',
      chain: { name: 'onchainkitchain' },
    });
    (useAccount as Mock).mockReturnValue({
      address: undefined,
      chain: { name: 'accountchain' },
    });
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);

    const { result } = renderHook(() => useGetFundingUrl({}));

    expect(result.current).toBeUndefined();
  });
});
