import type { GetSwapQuoteResponse } from '@/api';
import { RequestContext } from '@/core/network/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import React, { act, useCallback, useEffect } from 'react';
import type { TransactionReceipt } from 'viem';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  http,
  WagmiProvider,
  createConfig,
  useAccount,
  useChainId,
  useSendTransaction,
  useSwitchChain,
} from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { base } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { useSendCalls } from 'wagmi/experimental';
import { buildSwapTransaction } from '../../api/buildSwapTransaction';
import { getSwapQuote } from '../../api/getSwapQuote';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { SwapEvent } from '../../core/analytics/types';
import { useCapabilitiesSafe } from '../../internal/hooks/useCapabilitiesSafe';
import { DEGEN_TOKEN, ETH_TOKEN } from '../mocks';
import type { LifecycleStatus, SwapError } from '../types';
import { getSwapErrorCode } from '../utils/getSwapErrorCode';
import { SwapProvider, useSwapContext } from './SwapProvider';

const mockResetFunction = vi.fn();
vi.mock('../hooks/useResetInputs', () => ({
  useResetInputs: () => useCallback(mockResetFunction, []),
}));

vi.mock('@/api/getSwapQuote', () => ({
  getSwapQuote: vi.fn(),
}));

vi.mock('@/api/buildSwapTransaction', () => ({
  buildSwapTransaction: vi
    .fn()
    .mockRejectedValue(new Error('buildSwapTransaction')),
}));

vi.mock('../utils/processSwapTransaction', () => ({
  processSwapTransaction: vi.fn(),
}));

const mockSwitchChain = vi.fn();
vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useChainId: vi.fn(),
    useSwitchChain: vi.fn(),
    useSendTransaction: vi.fn(() => ({
      sendTransactionAsync: vi.fn(),
    })),
  };
});

const mockAwaitCalls = vi.fn();
vi.mock('../hooks/useAwaitCalls', () => ({
  useAwaitCalls: () => useCallback(mockAwaitCalls, []),
}));

vi.mock('@/internal/hooks/useCapabilitiesSafe', () => ({
  useCapabilitiesSafe: vi.fn(),
}));

vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useSendCalls: vi.fn(),
}));

vi.mock('../path/to/maxSlippageModule', () => ({
  getMaxSlippage: vi.fn().mockReturnValue(10),
}));

vi.mock('../../core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    sendAnalytics: vi.fn(),
  })),
}));

const queryClient = new QueryClient();

const accountConfig = createConfig({
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

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <WagmiProvider config={accountConfig}>
    <QueryClientProvider client={queryClient}>
      <SwapProvider
        config={{ maxSlippage: 5 }}
        experimental={{ useAggregator: true }}
      >
        {children}
      </SwapProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

const renderWithProviders = ({
  Component,
  onError = vi.fn(),
  onStatus = vi.fn(),
  onSuccess = vi.fn(),
}: {
  Component: () => React.ReactNode;
  onError?: (error: SwapError) => void;
  onStatus?: (status: LifecycleStatus) => void;
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
}) => {
  const config = { maxSlippage: 10 };
  const mockExperimental = { useAggregator: true };
  return render(
    <WagmiProvider config={accountConfig}>
      <QueryClientProvider client={queryClient}>
        <SwapProvider
          config={config}
          experimental={mockExperimental}
          onError={onError}
          onStatus={onStatus}
          onSuccess={onSuccess}
        >
          <Component />
        </SwapProvider>
      </QueryClientProvider>
    </WagmiProvider>,
  );
};

const TestSwapComponent = () => {
  const context = useSwapContext();
  useEffect(() => {
    context.from.setToken?.(ETH_TOKEN);
    context.from.setAmount?.('100');
    context.to.setToken?.(DEGEN_TOKEN);
  }, [context]);
  const handleStatusError = async () => {
    context.updateLifecycleStatus({
      statusName: 'error',
      statusData: {
        code: 'code',
        error: 'error_long_messages',
        message: '',
      },
    });
  };
  const handleStatusAmountChange = async () => {
    context.updateLifecycleStatus({
      statusName: 'amountChange',
      statusData: {
        amountFrom: '',
        amountTo: '',
      },
    });
  };
  const handleStatusTransactionPending = async () => {
    context.updateLifecycleStatus({
      statusName: 'transactionPending',
    });
  };
  const handleStatusTransactionApproved = async () => {
    context.updateLifecycleStatus({
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: '0x123',
        transactionType: 'ERC20',
      },
    });
  };
  const handleStatusSuccess = async () => {
    context.updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipt: { transactionHash: '0x123' },
      },
    } as unknown as LifecycleStatus);
  };
  return (
    <div data-testid="test-component">
      <span data-testid="context-value-lifecycleStatus-statusName">
        {context.lifecycleStatus.statusName}
      </span>
      {context.lifecycleStatus.statusName === 'error' && (
        <span data-testid="context-value-lifecycleStatus-statusData-code">
          {context.lifecycleStatus.statusData.code}
        </span>
      )}
      <button type="button" onClick={handleStatusError}>
        setLifecycleStatus.error
      </button>
      <button type="button" onClick={handleStatusAmountChange}>
        setLifecycleStatus.amountChange
      </button>
      <button type="button" onClick={handleStatusTransactionPending}>
        setLifecycleStatus.transactionPending
      </button>
      <button type="button" onClick={handleStatusTransactionApproved}>
        setLifecycleStatus.transactionApproved
      </button>
      <button type="button" onClick={handleStatusSuccess}>
        setLifecycleStatus.success
      </button>
      <button type="submit" onClick={() => context.handleSubmit()}>
        Swap
      </button>
    </div>
  );
};

describe('useSwapContext', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      address: '0x123',
    });
    (useChainId as ReturnType<typeof vi.fn>).mockReturnValue(8453);
    (useSendCalls as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      sendCallsAsync: vi.fn(),
    });
    (useSwitchChain as ReturnType<typeof vi.fn>).mockReturnValue({
      switchChainAsync: mockSwitchChain,
    });
    await act(async () => {
      renderWithProviders({ Component: () => null });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

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
      renderWithProviders({ Component: TestComponent });
    });
  });
});

describe('SwapProvider', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
      address: '0x123',
    });
    (useChainId as ReturnType<typeof vi.fn>).mockReturnValue(8453);
    (useSendCalls as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      sendCallsAsync: vi.fn(),
    });
    (useSwitchChain as ReturnType<typeof vi.fn>).mockReturnValue({
      switchChainAsync: mockSwitchChain,
    });
    (useCapabilitiesSafe as ReturnType<typeof vi.fn>).mockReturnValue({});
  });

  it('should reset inputs when setLifecycleStatus is called with success', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.updateLifecycleStatus({
        statusName: 'success',
        statusData: {
          transactionReceipt: { transactionHash: '0x123' },
        },
      } as unknown as LifecycleStatus);
    });
    await waitFor(() => {
      expect(mockResetFunction).toHaveBeenCalled();
    });
    expect(mockResetFunction).toHaveBeenCalledTimes(1);
  });

  it('should handle batched transactions', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    (useCapabilitiesSafe as ReturnType<typeof vi.fn>).mockReturnValue({
      atomicBatch: { supported: true },
      paymasterService: { supported: true },
      auxiliaryFunds: { supported: true },
    });
    (waitForTransactionReceipt as ReturnType<typeof vi.fn>).mockResolvedValue({
      transactionHash: 'receiptHash',
    });
    await act(async () => {
      result.current.updateLifecycleStatus({
        statusName: 'transactionApproved',
        statusData: {
          transactionType: 'Batched',
        },
      });
    });
    await waitFor(() => {
      expect(mockAwaitCalls).toHaveBeenCalled();
    });
    expect(mockAwaitCalls).toHaveBeenCalledTimes(1);
  });

  it('should emit onError when setLifecycleStatus is called with error', async () => {
    const onErrorMock = vi.fn();
    renderWithProviders({ Component: TestSwapComponent, onError: onErrorMock });
    const button = screen.getByText('setLifecycleStatus.error');
    fireEvent.click(button);
    expect(onErrorMock).toHaveBeenCalled();
  });

  it('should emit onStatus when setLifecycleStatus is called with amountChange', async () => {
    const onStatusMock = vi.fn();
    renderWithProviders({
      Component: TestSwapComponent,
      onStatus: onStatusMock,
    });
    const button = screen.getByText('setLifecycleStatus.amountChange');
    fireEvent.click(button);
    expect(onStatusMock).toHaveBeenCalled();
  });

  it('should persist statusData when upodating lifecycle status', async () => {
    const onStatusMock = vi.fn();
    renderWithProviders({
      Component: TestSwapComponent,
      onStatus: onStatusMock,
    });
    fireEvent.click(screen.getByText('setLifecycleStatus.transactionPending'));
    expect(onStatusMock).toHaveBeenLastCalledWith({
      statusName: 'transactionPending',
      statusData: {
        isMissingRequiredField: true,
        maxSlippage: 10,
      },
    });
    fireEvent.click(screen.getByText('setLifecycleStatus.transactionApproved'));
    expect(onStatusMock).toHaveBeenLastCalledWith({
      statusName: 'transactionApproved',
      statusData: {
        transactionHash: '0x123',
        transactionType: 'ERC20',
        isMissingRequiredField: true,
        maxSlippage: 10,
      },
    });
  });

  it('should not persist error when updating lifecycle status', async () => {
    const onStatusMock = vi.fn();
    renderWithProviders({
      Component: TestSwapComponent,
      onStatus: onStatusMock,
    });
    fireEvent.click(screen.getByText('setLifecycleStatus.error'));
    expect(onStatusMock).toHaveBeenLastCalledWith({
      statusName: 'error',
      statusData: {
        code: 'code',
        error: 'error_long_messages',
        message: '',
        isMissingRequiredField: true,
        maxSlippage: 10,
      },
    });
    fireEvent.click(screen.getByText('setLifecycleStatus.transactionPending'));
    expect(onStatusMock).toHaveBeenLastCalledWith({
      statusName: 'transactionPending',
      statusData: {
        isMissingRequiredField: true,
        maxSlippage: 10,
      },
    });
  });

  it('should update lifecycle status correctly after fetching quote for to token', async () => {
    vi.mocked(getSwapQuote).mockResolvedValueOnce({
      toAmount: '10',
      to: {
        decimals: 10,
      },
    } as unknown as GetSwapQuoteResponse);
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('from', '10', ETH_TOKEN, DEGEN_TOKEN);
    });
    expect(result.current.lifecycleStatus).toStrictEqual({
      statusName: 'amountChange',
      statusData: {
        amountFrom: '10',
        amountTo: '1e-9',
        isMissingRequiredField: false,
        maxSlippage: 5,
        tokenFrom: {
          address: '',
          name: 'ETH',
          symbol: 'ETH',
          chainId: 8453,
          decimals: 18,
          image:
            'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
        },
        tokenTo: {
          address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
          name: 'DEGEN',
          symbol: 'DEGEN',
          chainId: 8453,
          decimals: 18,
          image:
            'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
        },
      },
    });
  });

  it('should update lifecycle status correctly after fetching quote for from token', async () => {
    vi.mocked(getSwapQuote).mockResolvedValueOnce({
      toAmount: '10',
      to: {
        decimals: 10,
      },
    } as unknown as GetSwapQuoteResponse);
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('to', '10', ETH_TOKEN, DEGEN_TOKEN);
    });
    expect(result.current.lifecycleStatus).toStrictEqual({
      statusName: 'amountChange',
      statusData: {
        amountFrom: '1e-9',
        amountTo: '10',
        isMissingRequiredField: false,
        maxSlippage: 5,
        tokenTo: {
          address: '',
          name: 'ETH',
          symbol: 'ETH',
          chainId: 8453,
          decimals: 18,
          image:
            'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
        },
        tokenFrom: {
          address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
          name: 'DEGEN',
          symbol: 'DEGEN',
          chainId: 8453,
          decimals: 18,
          image:
            'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
        },
      },
    });
  });

  it('should emit onStatus when setLifecycleStatus is called with transactionPending', async () => {
    const onStatusMock = vi.fn();
    renderWithProviders({
      Component: TestSwapComponent,
      onStatus: onStatusMock,
    });
    const button = screen.getByText('setLifecycleStatus.transactionPending');
    fireEvent.click(button);
    expect(onStatusMock).toHaveBeenCalled();
  });

  it('should emit onStatus when setLifecycleStatus is called with transactionApproved', async () => {
    const onStatusMock = vi.fn();
    renderWithProviders({
      Component: TestSwapComponent,
      onStatus: onStatusMock,
    });
    const button = screen.getByText('setLifecycleStatus.transactionApproved');
    fireEvent.click(button);
    expect(onStatusMock).toHaveBeenCalled();
  });

  it('should emit onSuccess when setLifecycleStatus is called with success', async () => {
    const onSuccessMock = vi.fn();
    renderWithProviders({
      Component: TestSwapComponent,
      onSuccess: onSuccessMock,
    });
    const button = screen.getByText('setLifecycleStatus.success');
    fireEvent.click(button);
    expect(onSuccessMock).toHaveBeenCalled();
  });

  it('should reset status to init when setLifecycleStatus is called with success', async () => {
    const onStatusMock = vi.fn();
    renderWithProviders({
      Component: TestSwapComponent,
      onStatus: onStatusMock,
    });
    const button = screen.getByText('setLifecycleStatus.success');
    fireEvent.click(button);
    await waitFor(() => {
      expect(onStatusMock).toHaveBeenCalledWith(
        expect.objectContaining({
          statusName: 'init',
          statusData: {
            isMissingRequiredField: true,
            maxSlippage: 10,
          },
        }),
      );
    });
  });

  it('should emit onStatus when setLifecycleStatus is called with error', async () => {
    const onStatusMock = vi.fn();
    renderWithProviders({
      Component: TestSwapComponent,
      onStatus: onStatusMock,
    });
    const button = screen.getByText('setLifecycleStatus.error');
    fireEvent.click(button);
    expect(onStatusMock).toHaveBeenCalled();
  });

  it('should handle toggles', async () => {
    const TestComponent = () => {
      const { from, to, handleToggle } = useSwapContext();
      // biome-ignore lint: hello
      React.useEffect(() => {
        const initializeSwap = async () => {
          await act(async () => {
            from.setToken?.(ETH_TOKEN);
            to.setToken?.(DEGEN_TOKEN);
            handleToggle();
          });
        };
        initializeSwap();
        handleToggle();
      }, []);
      return null;
    };
    await act(async () => {
      renderWithProviders({ Component: TestComponent });
    });
  });

  it('should pass the correct slippage to getSwapQuote', async () => {
    const TestComponent = () => {
      const { handleAmountChange } = useSwapContext();
      // biome-ignore lint: hello
      React.useEffect(() => {
        const initializeSwap = () => {
          handleAmountChange('from', '100', ETH_TOKEN, DEGEN_TOKEN);
        };
        initializeSwap();
      }, []);
      return null;
    };
    await act(async () => {
      renderWithProviders({ Component: TestComponent });
    });
    expect(getSwapQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        maxSlippage: '10',
        amount: '100',
        amountReference: 'from',
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        useAggregator: true,
      }),
      RequestContext.Swap,
    );
  });

  it('should pass the correct amountReference to getSwapQuote', async () => {
    const TestComponent = () => {
      const { handleAmountChange } = useSwapContext();
      // biome-ignore lint: hello
      React.useEffect(() => {
        const initializeSwap = () => {
          handleAmountChange('to', '100', ETH_TOKEN, DEGEN_TOKEN);
        };
        initializeSwap();
      }, []);
      return null;
    };
    await act(async () => {
      renderWithProviders({ Component: TestComponent });
    });
    expect(getSwapQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        maxSlippage: '10',
        amount: '100',
        amountReference: 'from',
        from: ETH_TOKEN,
        to: DEGEN_TOKEN,
        useAggregator: true,
      }),
      RequestContext.Swap,
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
      renderWithProviders({ Component: TestComponent });
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
      result.current.from.setToken?.(ETH_TOKEN);
      result.current.from.setAmount?.('10');
      result.current.to.setToken?.(DEGEN_TOKEN);
      result.current.to.setAmount?.('1000');
    });
    await act(async () => {
      result.current.handleToggle();
    });
    expect(result.current.from.token?.symbol).toBe('DEGEN');
    expect(result.current.from.amount).toBe('1000');
    expect(result.current.to.token?.symbol).toBe('ETH');
    expect(result.current.to.amount).toBe('10');
  });

  it('should update amount and trigger quote', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('from', '10', ETH_TOKEN, DEGEN_TOKEN);
    });
    expect(getSwapQuote).toHaveBeenCalled();
    expect(result.current.to.loading).toBe(false);
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

  it('should setLifecycleStatus to error when getSwapQuote throws an error', async () => {
    const mockError = new Error('Test error');
    vi.mocked(getSwapQuote).mockRejectedValueOnce(mockError);
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('from', '10', ETH_TOKEN, DEGEN_TOKEN);
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: 'error',
      statusData: expect.objectContaining({
        code: 'TmSPc01',
        error: JSON.stringify(mockError),
        message: '',
      }),
    });
  });

  it('should setLifecycleStatus to error when getSwapQuote returns an error', async () => {
    vi.mocked(getSwapQuote).mockResolvedValueOnce({
      code: getSwapErrorCode('uncaught-quote'),
      error: 'Something went wrong',
      message: '',
    });
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('from', '10', ETH_TOKEN, DEGEN_TOKEN);
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: 'error',
      statusData: expect.objectContaining({
        code: 'UNCAUGHT_SWAP_QUOTE_ERROR',
        error: 'Something went wrong',
        message: '',
      }),
    });
  });

  it('should handle submit correctly', async () => {
    await act(async () => {
      renderWithProviders({ Component: TestSwapComponent });
    });
    await act(async () => {
      fireEvent.click(screen.getByText('Swap'));
    });
    expect(buildSwapTransaction).toBeCalledTimes(1);
  });

  it('should not call buildSwapTransaction when missing required fields', async () => {
    const TestComponent = () => {
      const context = useSwapContext();
      return (
        <button type="submit" onClick={context.handleSubmit}>
          Swap
        </button>
      );
    };
    renderWithProviders({ Component: TestComponent });
    fireEvent.click(screen.getByText('Swap'));
    expect(buildSwapTransaction).not.toBeCalled();
  });

  it('should setLifecycleStatus to error when buildSwapTransaction throws an "User rejected the request." error', async () => {
    const mockError = {
      shortMessage: 'User rejected the request.',
    };
    vi.mocked(buildSwapTransaction).mockRejectedValueOnce(mockError);
    renderWithProviders({ Component: TestSwapComponent });
    fireEvent.click(screen.getByText('Swap'));
    await waitFor(() => {
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusName')
          .textContent,
      ).toBe('error');
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusData-code')
          .textContent,
      ).toBe('TmSPc02');
    });
  });

  it('should setLifecycleStatus to error when buildSwapTransaction throws an error', async () => {
    const mockError = new Error('Test error');
    vi.mocked(buildSwapTransaction).mockRejectedValueOnce(mockError);
    renderWithProviders({ Component: TestSwapComponent });
    fireEvent.click(screen.getByText('Swap'));
    await waitFor(() => {
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusName')
          .textContent,
      ).toBe('error');
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusData-code')
          .textContent,
      ).toBe('TmSPc02');
    });
  });

  it('should setLifecycleStatus to error when buildSwapTransaction returns an error', async () => {
    vi.mocked(buildSwapTransaction).mockResolvedValueOnce({
      code: getSwapErrorCode('uncaught-swap'),
      error: 'Something went wrong',
      message: '',
    });
    renderWithProviders({ Component: TestSwapComponent });
    fireEvent.click(screen.getByText('Swap'));
    await waitFor(() => {
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusName')
          .textContent,
      ).toBe('error');
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusData-code')
          .textContent,
      ).toBe('UNCAUGHT_SWAP_ERROR');
    });
  });

  it('should use default maxSlippage when not provided in experimental', () => {
    const useTestHook = () => {
      const { lifecycleStatus } = useSwapContext();
      return lifecycleStatus;
    };
    const config = { maxSlippage: 3 };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WagmiProvider config={accountConfig}>
        <QueryClientProvider client={queryClient}>
          <SwapProvider config={config} experimental={{ useAggregator: true }}>
            {children}
          </SwapProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
    const { result } = renderHook(() => useTestHook(), { wrapper });
    expect(result.current.statusName).toBe('init');
    if (result.current.statusName === 'init') {
      expect(result.current.statusData.maxSlippage).toBe(3);
    }
  });

  it('should handle errors in handleSubmit', async () => {
    const mockError = new Error('Test error');
    vi.mocked(buildSwapTransaction).mockRejectedValueOnce(mockError);
    renderWithProviders({ Component: TestSwapComponent });
    fireEvent.click(screen.getByText('Swap'));
    await waitFor(() => {
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusName')
          .textContent,
      ).toBe('error');
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusData-code')
          .textContent,
      ).toBe('TmSPc02');
    });
  });

  it('should set transactionHash on success', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });

    await act(async () => {
      result.current.updateLifecycleStatus({
        statusName: 'success',
        statusData: {
          transactionReceipt: { transactionHash: '0x123' },
        },
      } as unknown as LifecycleStatus);
    });

    expect(result.current.transactionHash).toBe('0x123');
  });
});

describe('SwapProvider Analytics', () => {
  let sendAnalytics: Mock;

  beforeEach(() => {
    sendAnalytics = vi.fn();
    (useAnalytics as Mock).mockImplementation(() => ({
      sendAnalytics,
    }));

    (useAccount as Mock).mockReturnValue({
      address: '0x123',
      chainId: 1,
      isConnected: true,
    });

    (useSwitchChain as Mock).mockReturnValue({
      switchChainAsync: vi.fn().mockResolvedValue({}),
    });

    (useSendTransaction as Mock).mockReturnValue({
      sendTransactionAsync: vi.fn().mockResolvedValue({}),
    });

    (useSendCalls as Mock).mockReturnValue({
      sendCallsAsync: vi.fn().mockResolvedValue({}),
    });
  });

  it('should track swap success with undefined address', async () => {
    // Mock useAccount to return undefined address
    (useAccount as Mock).mockReturnValue({
      address: undefined,
      chainId: 1,
      isConnected: true,
    });

    const { result } = renderHook(() => useSwapContext(), { wrapper });

    // Set up initial context values
    act(() => {
      result.current.from.setToken?.(ETH_TOKEN);
      result.current.to.setToken?.(DEGEN_TOKEN);
      result.current.from.setAmount?.('100');
    });

    await act(async () => {
      result.current.updateLifecycleStatus({
        statusName: 'success',
        statusData: {
          transactionReceipt: { transactionHash: '0x123' },
        },
      } as unknown as LifecycleStatus);
    });

    expect(sendAnalytics).toHaveBeenCalledWith(
      SwapEvent.SwapSuccess,
      expect.objectContaining({
        transactionHash: '0x123',
        paymaster: false,
        amount: 100,
        from: 'ETH',
        to: 'DEGEN',
        address: '',
      }),
    );
  });

  it('should track swap success', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });

    // Set up initial context values
    act(() => {
      result.current.from.setToken?.(ETH_TOKEN);
      result.current.to.setToken?.(DEGEN_TOKEN);
      result.current.from.setAmount?.('100');
    });

    await act(async () => {
      result.current.updateLifecycleStatus({
        statusName: 'success',
        statusData: {
          transactionReceipt: { transactionHash: '0x123' },
        },
      } as unknown as LifecycleStatus);
    });

    expect(sendAnalytics).toHaveBeenCalledWith(
      SwapEvent.SwapSuccess,
      expect.objectContaining({
        transactionHash: '0x123',
        paymaster: false,
        amount: 100,
        from: 'ETH',
        to: 'DEGEN',
        address: '0x123',
      }),
    );
  });

  it('should track swap failure', async () => {
    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.updateLifecycleStatus({
        statusName: 'error',
        statusData: {
          error: 'Test error',
        },
      } as unknown as LifecycleStatus);
    });

    expect(sendAnalytics).toHaveBeenCalledWith(SwapEvent.SwapFailure, {
      error: 'Test error',
      metadata: expect.any(Object),
    });
  });

  it('should track swap initiation', async () => {
    vi.mocked(getSwapQuote).mockResolvedValueOnce({
      amountReference: 'from',
      from: ETH_TOKEN,
      to: DEGEN_TOKEN,
      fromAmount: '10',
      fromAmountUSD: '10',
      hasHighPriceImpact: false,
      priceImpact: '0.01',
      slippage: '0.005',
      toAmount: '10',
      toAmountUSD: '10',
    });

    const { result } = renderHook(() => useSwapContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('from', '10', ETH_TOKEN, DEGEN_TOKEN);
    });

    expect(sendAnalytics).toHaveBeenCalledWith(SwapEvent.SwapInitiated, {
      amount: 10,
    });
  });
});
