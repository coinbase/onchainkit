import { RequestContext } from '@/core/network/constants';
import { useExchangeRate } from '@/internal/hooks/useExchangeRate';
import { act, render, renderHook } from '@testing-library/react';
import { formatUnits } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { SendProvider, useSendContext } from './SendProvider';

vi.mock('../../WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
}));

vi.mock('@/internal/hooks/useExchangeRate', () => ({
  useExchangeRate: vi.fn().mockReturnValue(Promise.resolve()),
}));

vi.mock('../hooks/useSendTransaction', () => ({
  useSendTransaction: vi.fn(),
}));

vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');
  return {
    ...actual,
    formatUnits: vi.fn(),
  };
});

describe('useSendContext', () => {
  const mockUseWalletAdvancedContext = useWalletAdvancedContext as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletAdvancedContext.mockReturnValue({
      tokenBalances: [
        {
          address: '',
          symbol: 'ETH',
          decimals: 18,
          cryptoBalance: '2000000000000000000',
          fiatBalance: 4000,
        },
      ],
    });

    vi.mocked(formatUnits).mockReturnValue('2');
  });

  it('should provide send context when used within provider', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    expect(result.current).toEqual({
      isInitialized: expect.any(Boolean),
      lifecycleStatus: expect.any(Object),
      updateLifecycleStatus: expect.any(Function),
      ethBalance: expect.any(Number),
      selectedRecipientAddress: expect.any(Object),
      handleAddressSelection: expect.any(Function),
      selectedToken: null,
      handleRecipientInputChange: expect.any(Function),
      handleTokenSelection: expect.any(Function),
      handleResetTokenSelection: expect.any(Function),
      fiatAmount: null,
      handleFiatAmountChange: expect.any(Function),
      cryptoAmount: null,
      handleCryptoAmountChange: expect.any(Function),
      exchangeRate: undefined,
      exchangeRateLoading: undefined,
      selectedInputType: 'crypto',
      setSelectedInputType: expect.any(Function),
    });
  });

  it('should throw an error when used outside of SendProvider', () => {
    const TestComponent = () => {
      useSendContext();
      return null;
    };

    const originalError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow();

    console.error = originalError;
  });

  it('should initialize and set lifecycle status when the user has an ETH balance', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    expect(result.current.ethBalance).toBe(2);
    expect(result.current.lifecycleStatus.statusName).toBe('selectingAddress');
  });

  it('should initialize and set lifecycle status when the user does not have an ETH balance', () => {
    mockUseWalletAdvancedContext.mockReturnValue({
      tokenBalances: [
        {
          address: '0x0000000000000000000000000000000000000000',
          symbol: 'USDC',
          decimals: 6,
          cryptoBalance: '2000000000000000000',
          fiatBalance: 4000,
        },
      ],
    });
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    expect(result.current.ethBalance).toBe(0);
    expect(result.current.lifecycleStatus.statusName).toBe('fundingWallet');
  });

  it('should handle address selection', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    act(() => {
      result.current.handleAddressSelection({
        display: 'user.eth',
        value: '0x1234',
      });
    });

    expect(result.current.selectedRecipientAddress).toEqual({
      display: 'user.eth',
      value: '0x1234',
    });
    expect(result.current.lifecycleStatus.statusName).toBe('selectingToken');
  });

  it('should handle recipient input change', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    act(() => {
      result.current.handleAddressSelection({
        display: 'user.eth',
        value: '0x1234',
      });
    });

    expect(result.current.selectedRecipientAddress).toEqual({
      display: 'user.eth',
      value: '0x1234',
    });

    act(() => {
      result.current.handleRecipientInputChange();
    });

    expect(result.current.selectedRecipientAddress).toEqual({
      display: '',
      value: null,
    });

    expect(result.current.lifecycleStatus.statusName).toBe('selectingAddress');
    expect(result.current.lifecycleStatus.statusData).toEqual({
      isMissingRequiredField: true,
    });
  });

  it('should handle token selection', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    const token = {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '' as const,
      decimals: 18,
      cryptoBalance: 200000000000000,
      fiatBalance: 4000,
      chainId: 8453,
      image: '',
    };

    act(() => {
      result.current.handleTokenSelection(token);
    });

    expect(result.current.selectedToken).toEqual(token);
    expect(result.current.lifecycleStatus.statusName).toBe('amountChange');
  });

  it('should handle reset token selection', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    const token = {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '' as const,
      decimals: 18,
      cryptoBalance: 200000000000000,
      fiatBalance: 4000,
      chainId: 8453,
      image: '',
    };

    act(() => {
      result.current.handleTokenSelection(token);
      result.current.handleResetTokenSelection();
    });

    expect(result.current.selectedToken).toBeNull();
    expect(result.current.fiatAmount).toBeNull();
    expect(result.current.cryptoAmount).toBeNull();
    expect(result.current.lifecycleStatus.statusName).toBe('selectingToken');
  });

  it('should handle crypto amount change', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    const token = {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '' as const,
      decimals: 18,
      cryptoBalance: 200000000000000,
      fiatBalance: 4000,
      chainId: 8453,
      image: '',
    };

    act(() => {
      result.current.handleTokenSelection(token);
      result.current.handleCryptoAmountChange('1.0');
    });

    expect(result.current.cryptoAmount).toBe('1.0');
    expect(result.current.lifecycleStatus.statusName).toBe('amountChange');
  });

  it('should handle fiat amount change', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    const token = {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '' as const,
      decimals: 18,
      cryptoBalance: 200000000000000,
      fiatBalance: 4000,
      chainId: 8453,
      image: '',
    };

    act(() => {
      result.current.handleTokenSelection(token);
      result.current.handleFiatAmountChange('1000');
    });

    expect(result.current.fiatAmount).toBe('1000');
    expect(result.current.lifecycleStatus.statusName).toBe('amountChange');
  });

  it('should handle input type change', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    act(() => {
      result.current.setSelectedInputType('fiat');
    });

    expect(result.current.selectedInputType).toBe('fiat');
  });

  it('should call useExchangeRate with correct parameters when ETH token is selected', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    const ethToken = {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '' as const,
      decimals: 18,
      cryptoBalance: 200000000000000,
      fiatBalance: 4000,
      chainId: 8453,
      image: '',
    };

    act(() => {
      result.current.handleTokenSelection(ethToken);
    });

    expect(useExchangeRate).toHaveBeenCalledWith(
      {
        token: 'ETH',
        selectedInputType: 'crypto',
      },
      RequestContext.Wallet,
    );
  });

  it('should call useExchangeRate with token address for non-ETH tokens', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    const usdcToken = {
      name: 'USD Coin',
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const,
      decimals: 6,
      cryptoBalance: 5000000,
      fiatBalance: 5,
      chainId: 8453,
      image: '',
    };

    act(() => {
      result.current.handleTokenSelection(usdcToken);
    });

    expect(useExchangeRate).toHaveBeenCalledWith(
      {
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        selectedInputType: 'crypto',
      },
      RequestContext.Wallet,
    );
  });

  it('should call useExchangeRate when selectedInputType changes', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    const ethToken = {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '' as const,
      decimals: 18,
      cryptoBalance: 200000000000000,
      fiatBalance: 4000,
      chainId: 8453,
      image: '',
    };

    act(() => {
      result.current.handleTokenSelection(ethToken);
    });

    vi.clearAllMocks();

    act(() => {
      result.current.setSelectedInputType('fiat');
    });

    expect(useExchangeRate).toHaveBeenCalledWith(
      {
        token: 'ETH',
        selectedInputType: 'fiat',
      },
      RequestContext.Wallet,
    );
  });
});
