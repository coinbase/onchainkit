import { RequestContext } from '@/core/network/constants';
import { usePriceQuote } from '@/internal/hooks/usePriceQuote';
import { act, render, renderHook } from '@testing-library/react';
import { formatUnits } from 'viem';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { SendProvider, useSendContext } from './SendProvider';
import { usePortfolio } from '@/wallet/hooks/usePortfolio';
import { useAccount } from 'wagmi';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/wallet/hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('../../WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('@/internal/hooks/usePriceQuote', () => ({
  usePriceQuote: vi.fn().mockReturnValue({
    isLoading: undefined,
    data: null,
  }),
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
  beforeEach(() => {
    vi.clearAllMocks();

    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [
          {
            address: '',
            symbol: 'ETH',
            decimals: 18,
            cryptoBalance: '2000000000000000000',
            fiatBalance: 4000,
          },
        ],
      },
      isFetching: false,
    });

    (useAccount as Mock).mockReturnValue({
      address: '0x123',
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
      recipientState: expect.any(Object),
      updateRecipientInput: expect.any(Function),
      validateRecipientInput: expect.any(Function),
      selectRecipient: expect.any(Function),
      deselectRecipient: expect.any(Function),
      selectedToken: null,
      handleTokenSelection: expect.any(Function),
      handleResetTokenSelection: expect.any(Function),
      fiatAmount: null,
      handleFiatAmountChange: expect.any(Function),
      cryptoAmount: null,
      handleCryptoAmountChange: expect.any(Function),
      exchangeRate: 0,
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
    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [
          {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'USDC',
            decimals: 6,
            cryptoBalance: '2000000000000000000',
            fiatBalance: 4000,
          },
        ],
      },
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
      result.current.selectRecipient({
        phase: 'selected',
        input: '0x1234',
        address: '0x1234',
        displayValue: 'user.eth',
      });
    });

    expect(result.current.recipientState).toEqual({
      phase: 'selected',
      input: '0x1234',
      address: '0x1234',
      displayValue: 'user.eth',
    });
  });

  it('should handle recipient input change', () => {
    const { result } = renderHook(() => useSendContext(), {
      wrapper: SendProvider,
    });

    act(() => {
      result.current.updateRecipientInput('0x1234');
    });

    expect(result.current.recipientState).toEqual({
      phase: 'input',
      input: '0x1234',
      address: null,
      displayValue: null,
    });

    act(() => {
      result.current.deselectRecipient();
    });

    expect(result.current.recipientState).toEqual({
      phase: 'input',
      input: '0x1234',
      address: null,
      displayValue: null,
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

  it('should call usePriceQuote with correct parameters when ETH token is selected', () => {
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

    expect(usePriceQuote).toHaveBeenCalledWith(
      {
        token: 'ETH',
      },
      RequestContext.Wallet,
    );
  });

  it('should call usePriceQuote with token address for non-ETH tokens', () => {
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

    expect(usePriceQuote).toHaveBeenCalledWith(
      {
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      },
      RequestContext.Wallet,
    );
  });

  it('should call usePriceQuote when selectedInputType changes', () => {
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

    expect(usePriceQuote).toHaveBeenCalledWith(
      {
        token: 'ETH',
      },
      RequestContext.Wallet,
    );
  });

  it('should return the correct exchange rate when the price quote is loaded', () => {
    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [
          {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'USDC',
            decimals: 6,
            cryptoBalance: '2000000000000000000',
            fiatBalance: 4000,
          },
        ],
      },
    });

    const mockUsePriceQuote = usePriceQuote as ReturnType<typeof vi.fn>;
    mockUsePriceQuote.mockReturnValue({
      isLoading: false,
      data: {
        priceQuotes: [
          {
            name: 'Ethereum',
            symbol: 'ETH',
            contractAddress: '',
            price: '2000',
            timestamp: 1714761600,
          },
        ],
      },
    });

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

    expect(result.current.exchangeRate).toBe(1 / 2000);
  });

  it('should return 0 for exchange rate when the price quote response is empty', () => {
    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [
          {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'USDC',
            decimals: 6,
            cryptoBalance: '2000000000000000000',
            fiatBalance: 4000,
          },
        ],
      },
    });

    const mockUsePriceQuote = usePriceQuote as ReturnType<typeof vi.fn>;
    mockUsePriceQuote.mockReturnValue({
      isLoading: false,
      data: {
        priceQuotes: [],
      },
    });

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

    expect(result.current.exchangeRate).toBe(0);
  });

  it('should return 0 for exchange rate when the price quote response is an error', () => {
    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [
          {
            address: '0x0000000000000000000000000000000000000000',
            symbol: 'USDC',
            decimals: 6,
            cryptoBalance: '2000000000000000000',
            fiatBalance: 4000,
          },
        ],
      },
    });

    const mockUsePriceQuote = usePriceQuote as ReturnType<typeof vi.fn>;
    mockUsePriceQuote.mockReturnValue({
      isLoading: false,
      data: {
        error: {
          code: 'error',
          message: 'error',
          error: 'error',
        },
      },
    });

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

    expect(result.current.exchangeRate).toBe(0);
  });
});
