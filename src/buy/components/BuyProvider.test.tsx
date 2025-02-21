import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import React, { act, useCallback } from 'react';
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
  useSwitchChain,
} from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { base } from 'wagmi/chains';
import { mock } from 'wagmi/connectors';
import { useSendCalls } from 'wagmi/experimental';
import { buildSwapTransaction } from '../../api/buildSwapTransaction';
import type { GetSwapQuoteResponse } from '../../api/types';
import { useAnalytics } from '../../core/analytics/hooks/useAnalytics';
import { BuyEvent } from '../../core/analytics/types';
import { useCapabilitiesSafe } from '../../internal/hooks/useCapabilitiesSafe';
import type { LifecycleStatus, SwapError, SwapUnit } from '../../swap/types';
import { getSwapErrorCode } from '../../swap/utils/getSwapErrorCode';
import {
  daiToken,
  degenToken,
  ethToken,
  usdcToken,
} from '../../token/constants';
import { useOnchainKit } from '../../useOnchainKit';
import { useBuyTokens } from '../hooks/useBuyTokens';
import { getBuyQuote } from '../utils/getBuyQuote';
import { validateQuote } from '../utils/validateQuote';
import { BuyProvider, useBuyContext } from './BuyProvider';

const mockResetFunction = vi.fn();
vi.mock('../hooks/useResetBuyInputs', () => ({
  useResetBuyInputs: () => useCallback(mockResetFunction, []),
}));

vi.mock('../utils/getBuyQuote', () => ({
  getBuyQuote: vi.fn(),
}));

vi.mock('../utils/validateQuote', () => ({
  validateQuote: vi.fn(),
}));

vi.mock('../hooks/useBuyTokens', () => ({
  useBuyTokens: vi.fn(),
}));

vi.mock('@/api/buildSwapTransaction', () => ({
  buildSwapTransaction: vi
    .fn()
    .mockRejectedValue(new Error('buildSwapTransaction')),
}));

vi.mock('../../swap/utils/processSwapTransaction', () => ({
  processSwapTransaction: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

const mockSwitchChain = vi.fn();
vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
    useChainId: vi.fn(),
    useSwitchChain: vi.fn(),
  };
});

const mockAwaitCalls = vi.fn();
vi.mock('../../swap/hooks/useAwaitCalls', () => ({
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

const mockFromDai: SwapUnit = {
  balance: '100',
  amount: '',
  setAmount: vi.fn(),
  setAmountUSD: vi.fn(),
  token: daiToken,
  loading: false,
  setLoading: vi.fn(),
  error: undefined,
} as unknown as SwapUnit;

const mockToDegen: SwapUnit = {
  balance: '100',
  amount: '',
  setAmount: vi.fn(),
  setAmountUSD: vi.fn(),
  token: degenToken,
  loading: false,
  setLoading: vi.fn(),
  error: undefined,
} as unknown as SwapUnit;

const mockFromUsdc: SwapUnit = {
  balance: '100',
  amount: '',
  setAmount: vi.fn(),
  setAmountUSD: vi.fn(),
  token: usdcToken,
  loading: false,
  setLoading: vi.fn(),
  error: undefined,
} as unknown as SwapUnit;

const mockFromEth: SwapUnit = {
  balance: '100',
  amount: '50',
  setAmount: vi.fn(),
  setAmountUSD: vi.fn(),
  token: ethToken,
  loading: false,
  setLoading: vi.fn(),
  error: undefined,
} as unknown as SwapUnit;

const mockTransactionReceipt = {
  blockHash: '0xblock',
  blockNumber: 1n,
  contractAddress: '0xcontract',
  cumulativeGasUsed: 1n,
  effectiveGasPrice: 1n,
  from: '0xfrom',
  gasUsed: 1n,
  logs: [],
  logsBloom: '0xbloom',
  status: 'success',
  to: '0xto',
  transactionHash: '0x123',
  transactionIndex: 1,
  type: 'eip1559',
} as TransactionReceipt;

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
      <BuyProvider
        config={{ maxSlippage: 5 }}
        experimental={{ useAggregator: true }}
        toToken={degenToken}
        fromToken={daiToken}
      >
        {children}
      </BuyProvider>
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
  (useOnchainKit as Mock).mockReturnValue({
    projectId: 'mock-project-id',
    config: {
      paymaster: undefined,
    },
  });
  return render(
    <WagmiProvider config={accountConfig}>
      <QueryClientProvider client={queryClient}>
        <BuyProvider
          config={config}
          experimental={mockExperimental}
          onError={onError}
          onStatus={onStatus}
          onSuccess={onSuccess}
          toToken={degenToken}
          fromToken={daiToken}
        >
          <Component />
        </BuyProvider>
      </QueryClientProvider>
    </WagmiProvider>,
  );
};

const TestSwapComponent = () => {
  const context = useBuyContext();
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
      <button type="submit" onClick={() => context?.handleSubmit(mockFromEth)}>
        Swap
      </button>
    </div>
  );
};

describe('useBuyContext', () => {
  beforeEach(async () => {
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'mock-project-id',
      config: {
        paymaster: undefined,
      },
    });
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
    (validateQuote as Mock).mockReturnValue({
      isValid: true,
    });

    (useBuyTokens as Mock).mockReturnValue({
      from: mockFromDai,
      to: mockToDegen,
      fromETH: mockFromEth,
      fromUSDC: mockFromUsdc,
    });

    await act(async () => {
      renderWithProviders({ Component: () => null });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error when used outside of BuyProvider', () => {
    const TestComponent = () => {
      useBuyContext();
      return null;
    };
    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = vi.fn();
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useBuyContext must be used within a Buy component');
    // Restore console.error
    console.error = originalError;
  });

  it('should provide context when used within BuyProvider', async () => {
    const TestComponent = () => {
      const context = useBuyContext();
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

describe('BuyProvider', () => {
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
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'mock-project-id',
      config: {
        paymaster: undefined,
      },
    });
    (useBuyTokens as Mock).mockReturnValue({
      from: mockFromDai,
      to: mockToDegen,
      fromETH: mockFromEth,
      fromUSDC: mockFromUsdc,
    });
    (useAnalytics as Mock).mockImplementation(() => ({
      sendAnalytics: vi.fn(),
    }));
  });

  it('should call validateQuote with responses', async () => {
    const mockResponse = {
      response: { amountUsd: '10' },
    } as unknown as GetSwapQuoteResponse;
    vi.mocked(getBuyQuote).mockResolvedValue({ response: mockResponse });
    const { result } = renderHook(() => useBuyContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('10');
    });
    expect(validateQuote).toHaveBeenCalledWith({
      to: mockToDegen,
      responseETH: mockResponse,
      responseUSDC: mockResponse,
      responseFrom: mockResponse,
      updateLifecycleStatus: expect.any(Function),
    });
  });

  it('should not set lifecycle status to amountChange with invalid quote', async () => {
    const mockResponse = {
      response: { amountUsd: '10' },
    } as unknown as GetSwapQuoteResponse;
    vi.mocked(getBuyQuote).mockResolvedValue({ response: mockResponse });
    (validateQuote as Mock).mockReturnValue({
      isValid: false,
    });

    const { result } = renderHook(() => useBuyContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('10');
    });
    expect(result.current.lifecycleStatus).not.toEqual({
      statusName: 'amountChange',
      statusData: expect.objectContaining({
        isMissingRequiredField: false,
      }),
    });
  });

  it('should set lifecycle status to amountChange with valid quote', async () => {
    const mockResponse = {
      response: { amountUsd: '10' },
    } as unknown as GetSwapQuoteResponse;
    vi.mocked(getBuyQuote).mockResolvedValue({
      response: mockResponse,
      formattedFromAmount: '20',
    });
    (validateQuote as Mock).mockReturnValue({
      isValid: true,
    });

    const { result } = renderHook(() => useBuyContext(), { wrapper });

    await act(async () => {
      result.current.handleAmountChange('10');
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: 'amountChange',
      statusData: expect.objectContaining({
        amountETH: '20',
        amountUSDC: '20',
        amountFrom: '20',
        amountTo: '10',
      }),
    });
  });

  it('should set lifecycle status to amountChange with valid quote and empty formattedFromAmount', async () => {
    const mockResponse = {
      response: { amountUsd: '10' },
    } as unknown as GetSwapQuoteResponse;
    vi.mocked(getBuyQuote).mockResolvedValue({
      response: mockResponse,
      formattedFromAmount: '',
    });
    (validateQuote as Mock).mockReturnValue({
      isValid: true,
    });

    const { result } = renderHook(() => useBuyContext(), { wrapper });

    await act(async () => {
      result.current.handleAmountChange('10');
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: 'amountChange',
      statusData: expect.objectContaining({
        amountETH: '',
        amountUSDC: '',
        amountFrom: '',
        amountTo: '10',
      }),
    });
  });

  it('should reset inputs when setLifecycleStatus is called with success', async () => {
    const { result } = renderHook(() => useBuyContext(), { wrapper });
    await act(async () => {
      result.current.updateLifecycleStatus({
        statusName: 'success',
        statusData: {
          transactionReceipt: { transactionHash: '0x123' },
        },
      } as unknown as LifecycleStatus);
    });

    await waitFor(
      () => {
        expect(mockResetFunction).toHaveBeenCalled();
      },
      { timeout: 5000 },
    );

    expect(mockResetFunction).toHaveBeenCalledTimes(1);
  });

  it('should handle batched transactions', async () => {
    const { result } = renderHook(() => useBuyContext(), { wrapper });
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

  it('should pass the correct slippage to getBuyQuote', async () => {
    const TestComponent = () => {
      const { handleAmountChange } = useBuyContext();
      // biome-ignore lint: hello
      React.useEffect(() => {
        const initializeSwap = () => {
          handleAmountChange('5');
        };
        initializeSwap();
      }, []);
      return null;
    };
    await act(async () => {
      renderWithProviders({ Component: TestComponent });
    });
    expect(getBuyQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        maxSlippage: '10',
        amount: '5',
        from: ethToken,
        to: degenToken,
        useAggregator: true,
      }),
    );
  });

  it('should set lifecycle status to amountChange with missing required fields when to token is undefined', async () => {
    (useBuyTokens as Mock).mockReturnValue({
      from: mockFromDai,
      to: { ...mockToDegen, token: undefined },
      fromETH: mockFromEth,
      fromUSDC: mockFromUsdc,
    });
    const { result } = renderHook(() => useBuyContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('10');
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: 'amountChange',
      statusData: expect.objectContaining({
        isMissingRequiredField: true,
      }),
    });
  });

  it('should handle undefined in input', async () => {
    const TestComponent = () => {
      const { handleAmountChange } = useBuyContext();
      // biome-ignore lint: hello
      React.useEffect(() => {
        const initializeSwap = () => {
          handleAmountChange('100');
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
    const { result } = renderHook(() => useBuyContext(), { wrapper });
    expect(result.current.from?.amount).toBe('');
    expect(result.current.to?.amount).toBe('');
    expect(result.current.to?.amount).toBe('');
  });

  it('should update amount and trigger quote', async () => {
    const { result } = renderHook(() => useBuyContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('10');
    });
    expect(getBuyQuote).toHaveBeenCalled();
    expect(result.current.to?.loading).toBe(false);
  });

  it('should handle empty amount input', async () => {
    const { result } = renderHook(() => useBuyContext(), { wrapper });
    await act(async () => {
      await result.current.handleAmountChange('');
    });
    expect(result.current.to?.amount).toBe('');
  });

  it('should handle zero amount input', async () => {
    const { result } = renderHook(() => useBuyContext(), { wrapper });
    await act(async () => {
      await result.current.handleAmountChange('0');
    });
    expect(result.current.to?.amount).toBe('');
  });

  it('should not setLifecycleStatus to error when getBuyQuote throws an error', async () => {
    const mockError = new Error('Test error');
    vi.mocked(getBuyQuote).mockRejectedValueOnce(mockError);
    const { result } = renderHook(() => useBuyContext(), { wrapper });
    await act(async () => {
      result.current.handleAmountChange('10');
    });
    expect(result.current.lifecycleStatus).toEqual({
      statusName: 'error',
      statusData: expect.objectContaining({
        code: 'TmBPc02',
        error: JSON.stringify(mockError),
        message: '',
      }),
    });
  });

  it('logs an error when projectId is not provided', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (useOnchainKit as Mock).mockReturnValue({
      projectId: undefined,
      config: {
        paymaster: undefined,
      },
    });

    renderHook(() => useBuyContext(), { wrapper });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Project ID is required for this component, please set the projectId in the OnchainKitProvider',
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle submit correctly', async () => {
    (useBuyTokens as Mock).mockReturnValue({
      from: mockFromDai,
      to: { ...mockToDegen, amount: '50' },
      fromETH: { ...mockFromEth, amount: '100' },
      fromUSDC: mockFromUsdc,
    });
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
      const context = useBuyContext();
      return (
        <button
          type="submit"
          onClick={() => context.handleSubmit(context.from as SwapUnit)}
        >
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
      ).toBe('TmBPc03');
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
      ).toBe('TmBPc03');
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
      const { lifecycleStatus } = useBuyContext();
      return lifecycleStatus;
    };
    const config = { maxSlippage: 3 };
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <WagmiProvider config={accountConfig}>
        <QueryClientProvider client={queryClient}>
          <BuyProvider
            config={config}
            experimental={{ useAggregator: true }}
            toToken={usdcToken}
          >
            {children}
          </BuyProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
    const { result } = renderHook(() => useTestHook(), { wrapper });
    expect(result.current.statusName).toBe('init');
    if (result.current.statusName === 'init') {
      expect(result.current.statusData.maxSlippage).toBe(3);
    }
  });

  describe('analytics', () => {
    let sendAnalytics: Mock;

    beforeEach(() => {
      sendAnalytics = vi.fn();
      (useAnalytics as Mock).mockImplementation(() => ({
        sendAnalytics,
      }));

      (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
        address: '0x123',
      });
      (useChainId as ReturnType<typeof vi.fn>).mockReturnValue(8453);
      (useBuyTokens as Mock).mockReturnValue({
        from: mockFromDai,
        to: mockToDegen,
        fromETH: mockFromEth,
        fromUSDC: mockFromUsdc,
      });
    });

    it('should track BuySuccess event on successful swap', async () => {
      const { result } = renderHook(() => useBuyContext(), { wrapper });

      await act(async () => {
        result.current.updateLifecycleStatus({
          statusName: 'transactionApproved',
          statusData: {
            transactionHash: '0x123',
            transactionType: 'ERC20',
          },
        });

        result.current.updateLifecycleStatus({
          statusName: 'success',
          statusData: {
            transactionReceipt: mockTransactionReceipt,
          },
        } as unknown as LifecycleStatus);
      });

      expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuySuccess, {
        address: '0x123',
        amount: 0,
        from: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
        paymaster: false,
        to: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed',
        transactionHash: '0x123',
      });
    });

    it('should not track BuyInitiated event when getting quote', async () => {
      const { result } = renderHook(() => useBuyContext(), { wrapper });

      await act(async () => {
        result.current.handleAmountChange('10');
      });

      expect(sendAnalytics).not.toHaveBeenCalledWith(BuyEvent.BuyInitiated, {
        amount: 10,
        token: degenToken.symbol,
      });
    });

    it('should track BuyInitiated event when submitting swap', async () => {
      renderWithProviders({ Component: TestSwapComponent });

      await act(async () => {
        fireEvent.click(screen.getByText('Swap'));
      });

      expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuyInitiated, {
        amount: Number(mockFromEth.amount),
        token: mockFromEth.token?.symbol,
      });
    });

    it('should track BuyFailure event when swap fails', async () => {
      const mockError = new Error('Test error');
      vi.mocked(buildSwapTransaction).mockRejectedValueOnce(mockError);

      renderWithProviders({ Component: TestSwapComponent });

      await act(async () => {
        fireEvent.click(screen.getByText('Swap'));
      });

      await waitFor(() => {
        expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuyFailure, {
          error: mockError.message,
          metadata: {
            token: ethToken.symbol,
            amount: '50',
          },
        });
      });
    });

    it('should track BuyFailure event when quote fails', async () => {
      const mockError = new Error('Quote error');
      vi.mocked(getBuyQuote).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useBuyContext(), { wrapper });

      await act(async () => {
        result.current.handleAmountChange('10');
      });

      expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuyFailure, {
        error: mockError.message,
        metadata: { amount: '10' },
      });
    });

    it('should track BuySuccess event with empty values when fields are undefined', async () => {
      // Mock tokens as undefined
      (useBuyTokens as Mock).mockReturnValue({
        from: { ...mockFromDai, token: undefined },
        to: { ...mockToDegen, token: undefined },
        fromETH: { ...mockFromEth, token: undefined },
        fromUSDC: { ...mockFromUsdc, token: undefined },
      });

      const { result } = renderHook(() => useBuyContext(), { wrapper });

      await act(async () => {
        result.current.updateLifecycleStatus({
          statusName: 'success',
          statusData: {
            transactionReceipt: {
              ...mockTransactionReceipt,
              transactionHash: undefined,
            },
          },
        } as unknown as LifecycleStatus);
      });

      expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuySuccess, {
        address: '0x123',
        amount: 0,
        from: '',
        paymaster: false,
        to: '',
        transactionHash: '',
      });
    });

    it('should track BuyInitiated event with empty token when token is undefined', async () => {
      (useBuyTokens as Mock).mockReturnValue({
        from: mockFromDai,
        to: mockToDegen,
        fromETH: { ...mockFromEth, token: undefined },
        fromUSDC: mockFromUsdc,
      });

      renderWithProviders({ Component: TestSwapComponent });

      await act(async () => {
        fireEvent.click(screen.getByText('Swap'));
      });

      expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuyInitiated, {
        amount: Number(mockFromEth.amount),
        token: 'ETH',
      });
    });

    it('should track BuyFailure event with empty metadata when not provided', async () => {
      const mockError = new Error('Test error');
      vi.mocked(getBuyQuote).mockRejectedValueOnce(mockError);

      const { result } = renderHook(() => useBuyContext(), { wrapper });

      await act(async () => {
        result.current.handleAmountChange('10');
      });

      expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuyFailure, {
        error: mockError.message,
        metadata: { amount: '10' },
      });
    });

    it('should handle non-Error objects in error handling', async () => {
      const nonErrorObject = { message: 'Custom error object' };
      vi.mocked(getBuyQuote).mockRejectedValueOnce(nonErrorObject);

      const { result } = renderHook(() => useBuyContext(), { wrapper });

      await act(async () => {
        result.current.handleAmountChange('10');
      });

      expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuyFailure, {
        error: String(nonErrorObject),
        metadata: { amount: '10' },
      });
    });

    it('should handle string errors in error handling', async () => {
      const stringError = 'String error message';
      vi.mocked(getBuyQuote).mockRejectedValueOnce(stringError);

      const { result } = renderHook(() => useBuyContext(), { wrapper });

      await act(async () => {
        result.current.handleAmountChange('10');
      });

      expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuyFailure, {
        error: stringError,
        metadata: { amount: '10' },
      });
    });

    it('should handle Error objects in error handling', async () => {
      const errorObject = new Error('Test error message');
      vi.mocked(getBuyQuote).mockRejectedValueOnce(errorObject);

      const { result } = renderHook(() => useBuyContext(), { wrapper });

      await act(async () => {
        result.current.handleAmountChange('10');
      });

      expect(sendAnalytics).toHaveBeenCalledWith(BuyEvent.BuyFailure, {
        error: errorObject.message,
        metadata: { amount: '10' },
      });
    });
  });
});
