import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import React from 'react';
import type { TransactionReceipt } from 'viem';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { http, WagmiProvider, createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { DEGEN_TOKEN, ETH_TOKEN } from '../mocks';
import type { SwapError } from '../types';
import { buildSwapTransaction } from '../utils/buildSwapTransaction';
import { getSwapQuote } from '../utils/getSwapQuote';
import { SwapProvider, useSwapContext } from './SwapProvider';

vi.mock('../utils/getSwapQuote', () => ({
  getSwapQuote: vi.fn(),
}));

vi.mock('../utils/buildSwapTransaction', () => ({
  buildSwapTransaction: vi
    .fn()
    .mockRejectedValue(new Error('buildSwapTransaction')),
}));

vi.mock('../utils/processSwapTransaction', () => ({
  processSwapTransaction: vi.fn(),
}));

const queryClient = new QueryClient();

const config = createConfig({
  chains: [base],
  connectors: [
    mock({
      accounts: [
        '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      ],
    }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const wrapper = ({ children }) => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <SwapProvider
        address="0x1234567890123456789012345678901234567890"
        experimental={{ useAggregator: true, maxSlippage: 5 }}
      >
        {children}
      </SwapProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

const renderWithProviders = (
  Component: React.ComponentType,
  onStatus = vi.fn(),
) => {
  const mockAddress = '0x1234567890123456789012345678901234567890';
  const mockExperimental = { useAggregator: true, maxSlippage: 10 };
  return render(
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <SwapProvider
          address={mockAddress}
          experimental={mockExperimental}
          onStatus={onStatus}
        >
          <Component />
        </SwapProvider>
      </QueryClientProvider>
    </WagmiProvider>,
  );
};

const TestSwapComponent = () => {
  const context = useSwapContext();
  const handleStatusError = async () => {
    context.setLifeCycleStatus({
      statusName: 'error',
      statusData: { code: 'code', error: 'error_long_messages', message: '' },
    });
  };
  return (
    <div data-testid="test-component">
      <span data-testid="context-value-lifeCycleStatus-statusName">
        {context.lifeCycleStatus.statusName}
      </span>
      <button type="button" onClick={handleStatusError}>
        setLifeCycleStatus.error
      </button>
    </div>
  );
};

describe('useSwapContext', () => {
  it('should throw an error when used outside of SwapProvider', () => {
    const TestComponent = () => {
      useSwapContext();
      return null;
    };
    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = vi.fn();
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSwapContext must be used within a Swap component');
    // Restore console.error
    console.error = originalError;
  });

  it('should provide context when used within SwapProvider', async () => {
    const TestComponent = () => {
      const context = useSwapContext();
      expect(context).toBeDefined();
      expect(context.from).toBeDefined();
      expect(context.to).toBeDefined();
      expect(context.handleAmountChange).toBeDefined();
      return null;
    };
    await act(async () => {
      renderWithProviders(TestComponent);
    });
  });
});

describe('SwapProvider', () => {
  it('should emit onStatus when setLifeCycleStatus is called with error', async () => {
    const onStatusMock = vi.fn();
    renderWithProviders(TestSwapComponent, onStatusMock);
    const button = screen.getByText('setLifeCycleStatus.error');
    fireEvent.click(button);
    expect(onStatusMock).toHaveBeenCalled();
  });

  it('should handle submit correctly', async () => {
    const mockOnError = vi.fn();
    const mockOnSuccess = vi.fn();
    let _submitFunction: (
      onError?: (error: SwapError) => void,
      onSuccess?: (txReceipt: TransactionReceipt) => void | Promise<void>,
    ) => void;
    const TestComponent = () => {
      const { from, to, handleSubmit } = useSwapContext();
      _submitFunction = handleSubmit;
      // biome-ignore lint: hello
      React.useEffect(() => {
        from.setToken(ETH_TOKEN);
        from.setAmount('100');
        to.setToken(DEGEN_TOKEN);
      }, []);
      return (
        <button
          type="submit"
          onClick={() => handleSubmit(mockOnError, mockOnSuccess)}
        >
          Submit Swap
        </button>
      );
    };
    await act(async () => {
      renderWithProviders(TestComponent);
    });
    // Trigger the submit
    await act(async () => {
      fireEvent.click(screen.getByText('Submit Swap'));
    });
    expect(buildSwapTransaction).toBeCalledTimes(1);
  });

  it('should handle toggles', async () => {
    const TestComponent = () => {
      const { from, to, handleToggle } = useSwapContext();
      // biome-ignore lint: hello
      React.useEffect(() => {
        const initializeSwap = async () => {
          await act(async () => {
            from.setToken(ETH_TOKEN);
            to.setToken(DEGEN_TOKEN);
            handleToggle();
          });
        };
        initializeSwap();
        handleToggle();
      }, []);
      return null;
    };
    await act(async () => {
      renderWithProviders(TestComponent);
    });
  });

  it('should pass the correct slippage to getSwapQuote', async () => {
    const TestComponent = () => {
      const { from, to, handleAmountChange } = useSwapContext();
      // biome-ignore lint: hello
      React.useEffect(() => {
        const initializeSwap = () => {
          from.setToken(ETH_TOKEN);
          to.setToken(DEGEN_TOKEN);
          handleAmountChange('from', '100', ETH_TOKEN, DEGEN_TOKEN);
        };
        initializeSwap();
      }, []);
      return null;
    };
    await act(async () => {
      renderWithProviders(TestComponent);
    });
    // Assert that getSwapQuote was called with the correct parameters
    expect(getSwapQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        maxSlippage: '10',
        amount: '100',
        amountReference: 'from',
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        useAggregator: true,
      }),
    );
  });

  it('should handle undefined in input', async () => {
    const TestComponent = () => {
      const { handleAmountChange } = useSwapContext();
      // biome-ignore lint: hello
      React.useEffect(() => {
        const initializeSwap = () => {
          handleAmountChange('from', '100', undefined, undefined);
        };
        initializeSwap();
      }, []);
      return null;
    };
    await act(async () => {
      renderWithProviders(TestComponent);
    });
  });

  it('should initialize with empty values', () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    expect(result.current.from.token).toBeUndefined();
    expect(result.current.from.amount).toBe('');
    expect(result.current.to.token).toBeUndefined();
    expect(result.current.to.amount).toBe('');
  });

  it('should toggle tokens and amounts', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.from.setToken(ETH_TOKEN);
      result.current.from.setAmount('10');
      result.current.to.setToken(DEGEN_TOKEN);
      result.current.to.setAmount('1000');
    });
    await act(async () => {
      result.current.handleToggle();
    });
    expect(result.current.from.token?.symbol).toBe('DEGEN');
    expect(result.current.from.amount).toBe('1000');
    expect(result.current.to.token?.symbol).toBe('ETH');
    expect(result.current.to.amount).toBe('10');
  });

  it('should handle submit with missing data', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.handleSubmit();
    });
    expect(result.current.error).toBeUndefined();
    expect(result.current.loading).toBe(false);
  });

  it('should update amount and trigger quote', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('from', '10', ETH_TOKEN, DEGEN_TOKEN);
    });
    expect(getSwapQuote).toHaveBeenCalled();
    expect(result.current.to.loading).toBe(false);
  });

  it('should handle quote error', async () => {
    vi.mocked(getSwapQuote).mockRejectedValueOnce(new Error('Quote error'));
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('from', '10', ETH_TOKEN, DEGEN_TOKEN);
    });
    expect(result.current.error?.quoteError).toBeDefined();
  });

  it('should handle empty amount input', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      await result.current.handleAmountChange(
        'from',
        '',
        ETH_TOKEN,
        DEGEN_TOKEN,
      );
    });
    expect(result.current.to.amount).toBe('');
  });

  it('should handle zero amount input', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      await result.current.handleAmountChange(
        'from',
        '0',
        ETH_TOKEN,
        DEGEN_TOKEN,
      );
    });
    expect(result.current.to.amount).toBe('');
  });

  it('should handle quote error and reset loading state', async () => {
    vi.mocked(getSwapQuote).mockRejectedValueOnce(new Error('Quote error'));
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      await result.current.handleAmountChange(
        'from',
        '10',
        ETH_TOKEN,
        DEGEN_TOKEN,
      );
    });
    expect(result.current.error?.quoteError).toBeDefined();
    expect(result.current.to.loading).toBe(false);
  });

  beforeEach(async () => {
    vi.resetAllMocks();
    await act(async () => {
      renderWithProviders(() => null);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
