// @ts-nocheck -- made simple fixes for now, will fix rest later
import { TransactionEvent } from '@/core/analytics/types';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { useCapabilitiesSafe } from '../../internal/hooks/useCapabilitiesSafe';
import { useOnchainKit } from '../../useOnchainKit';
import { useCallsStatus } from '../hooks/useCallsStatus';
import { useSendCall } from '../hooks/useSendCall';
import { useSendCalls } from '../hooks/useSendCalls';
import { useSendWalletTransactions } from '../hooks/useSendWalletTransactions';
import {
  TransactionProvider,
  useTransactionContext,
} from './TransactionProvider';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useSwitchChain: vi.fn(),
  useWaitForTransactionReceipt: vi.fn(),
  useConfig: vi.fn(),
  waitForTransactionReceipt: vi.fn(),
}));

vi.mock('wagmi/actions', () => ({
  waitForTransactionReceipt: vi.fn(),
}));

vi.mock('../hooks/useCallsStatus', () => ({
  useCallsStatus: vi.fn(),
}));

vi.mock('../hooks/useSendCall', () => ({
  useSendCall: vi.fn(),
}));

vi.mock('../hooks/useSendCalls', () => ({
  useSendCalls: vi.fn(),
}));

vi.mock('../hooks/useSendWalletTransactions', () => ({
  useSendWalletTransactions: vi.fn(),
}));

vi.mock('@/internal/hooks/useCapabilitiesSafe', () => ({
  useCapabilitiesSafe: vi.fn(),
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('@/core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    sendAnalytics: vi.fn(),
  })),
}));

const silenceError = () => {
  const consoleErrorMock = vi
    .spyOn(console, 'error')
    .mockImplementation(() => {});
  return () => consoleErrorMock.mockRestore();
};

const TestComponent = () => {
  const context = useTransactionContext();
  const handleStatusError = async () => {
    context.setLifecycleStatus({
      statusName: 'error',
      statusData: {
        code: 'code',
        error: 'error_long_messages',
        message: 'error_long_messages',
      },
    });
  };
  const handleStatusTransactionLegacyExecuted = async () => {
    context.setLifecycleStatus({
      statusName: 'transactionLegacyExecuted',
      statusData: {
        transactionHashList: ['0xhash12345678'],
      },
    });
  };
  const handleStatusTransactionLegacyExecutedMultipleContracts = async () => {
    await context.onSubmit();
    await context.setLifecycleStatus({
      statusName: 'transactionLegacyExecuted',
      statusData: {
        transactionHashList: ['0xhash12345678', '0xhash12345678'],
      },
    });
  };

  return (
    <div data-testid="test-component">
      <span data-testid="transactions">
        {JSON.stringify(context.transactions)}
      </span>
      <button type="button" onClick={context.onSubmit}>
        Submit
      </button>
      <span data-testid="context-value-errorCode">{context.errorCode}</span>
      <span data-testid="context-value-errorMessage">
        {context.errorMessage}
      </span>
      <span data-testid="context-value-lifecycleStatus-statusName">
        {context.lifecycleStatus.statusName}
      </span>
      <span data-testid="context-value-isToastVisible">
        {`${context.isToastVisible}`}
      </span>
      <button type="button" onClick={handleStatusError}>
        setLifecycleStatus.error
      </button>
      <button type="button" onClick={handleStatusTransactionLegacyExecuted}>
        setLifecycleStatus.transactionLegacyExecuted
      </button>
      <button
        type="button"
        onClick={handleStatusTransactionLegacyExecutedMultipleContracts}
      >
        setLifecycleStatus.transactionLegacyExecutedMultipleContracts
      </button>
    </div>
  );
};

let mockSendAnalytics: Mock;

vi.mock('@/core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    sendAnalytics: mockSendAnalytics,
  }),
}));

describe('TransactionProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({ chainId: 1 });
    (useSwitchChain as ReturnType<typeof vi.fn>).mockReturnValue({
      switchChainAsync: vi.fn(),
    });
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      transactionHash: null,
      status: 'idle',
    });
    (useSendCall as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      sendCallAsync: vi.fn(),
      reset: vi.fn(),
    });
    (useSendCalls as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      sendCallsAsync: vi.fn(),
      reset: vi.fn(),
    });
    (useWaitForTransactionReceipt as ReturnType<typeof vi.fn>).mockReturnValue({
      receipt: undefined,
    });
    (useCapabilitiesSafe as ReturnType<typeof vi.fn>).mockReturnValue({});
    (useOnchainKit as Mock).mockReturnValue({
      config: { paymaster: null },
    });
    mockSendAnalytics = vi.fn();
  });

  it('should emit onError when setLifecycleStatus is called with error', async () => {
    const onErrorMock = vi.fn();
    render(
      <TransactionProvider chainId={base.id} calls={[]} onError={onErrorMock}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('setLifecycleStatus.error');
    fireEvent.click(button);
    expect(onErrorMock).toHaveBeenCalled();
  });

  it('should emit onStatus when setLifecycleStatus is called with transactionLegacyExecuted', async () => {
    const onStatusMock = vi.fn();
    render(
      <TransactionProvider chainId={base.id} calls={[]} onStatus={onStatusMock}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText(
      'setLifecycleStatus.transactionLegacyExecuted',
    );
    fireEvent.click(button);
    expect(onStatusMock).toHaveBeenCalledWith({
      statusName: 'transactionLegacyExecuted',
      statusData: {
        transactionHashList: ['0xhash12345678'],
      },
    });
  });

  it('should emit onStatus when setLifecycleStatus is called', async () => {
    const onStatusMock = vi.fn();
    render(
      <TransactionProvider chainId={base.id} calls={[]} onStatus={onStatusMock}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('setLifecycleStatus.error');
    fireEvent.click(button);
    expect(onStatusMock).toHaveBeenCalled();
  });

  it('should emit onSuccess when one receipt exist', async () => {
    const onSuccessMock = vi.fn();
    (useWaitForTransactionReceipt as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { status: 'success' },
    });
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      transactionHash: 'hash',
    });
    render(
      <TransactionProvider
        chainId={base.id}
        calls={[
          {
            to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
            data: '0x' as `0x${string}`,
          },
        ]}
        onSuccess={onSuccessMock}
      >
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onSuccessMock).toHaveBeenCalledWith({
        transactionReceipts: [{ status: 'success' }],
      });
    });
  });

  it('should emit onSuccess for multiple contracts using legacy transactions', async () => {
    const onSuccessMock = vi.fn();
    (waitForTransactionReceipt as ReturnType<typeof vi.fn>).mockReturnValue(
      'hash12345678',
    );
    render(
      <TransactionProvider
        chainId={base.id}
        calls={[
          {
            to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
            data: '0x' as `0x${string}`,
          },
          {
            to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
            data: '0x' as `0x${string}`,
          },
        ]}
        onSuccess={onSuccessMock}
      >
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText(
      'setLifecycleStatus.transactionLegacyExecutedMultipleContracts',
    );
    fireEvent.click(button);
    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
      expect(onSuccessMock).toHaveBeenCalledWith({
        transactionReceipts: ['hash12345678', 'hash12345678'],
      });
    });
  });

  it('should emit onError when building transactions fails', async () => {
    const sendWalletTransactionsMock = vi.fn();
    (useSendWalletTransactions as ReturnType<typeof vi.fn>).mockReturnValue(
      sendWalletTransactionsMock,
    );
    const onErrorMock = vi.fn();
    const contracts = () => Promise.reject(new Error('error'));
    render(
      <TransactionProvider
        chainId={base.id}
        calls={contracts}
        onError={onErrorMock}
      >
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(onErrorMock).toHaveBeenCalledWith({
        code: 'TmTPc04',
        error: '{}',
        message: 'Error building transactions',
      });
    });
  });

  it('should emit onError when legacy transactions fail', async () => {
    const sendWalletTransactionsMock = vi.fn().mockResolvedValue(undefined);
    (useSendWalletTransactions as ReturnType<typeof vi.fn>).mockReturnValue(
      sendWalletTransactionsMock,
    );
    const onErrorMock = vi.fn();
    (waitForTransactionReceipt as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('error getting transaction receipt'),
    );
    render(
      <TransactionProvider
        chainId={base.id}
        calls={[
          {
            to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
            data: '0x' as `0x${string}`,
          },
          {
            to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
            data: '0x' as `0x${string}`,
          },
        ]}
        onError={onErrorMock}
      >
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText(
      'setLifecycleStatus.transactionLegacyExecutedMultipleContracts',
    );
    fireEvent.click(button);
    await waitFor(() => {
      expect(sendWalletTransactionsMock).toHaveBeenCalled();
      expect(onErrorMock).toHaveBeenCalledWith({
        code: 'TmTPc01',
        error: '{}',
        message: 'Something went wrong. Please try again.',
      });
    });
  });

  it('should set setLifecycleStatus to transactionPending when writeContractsAsync is pending', async () => {
    const writeContractsAsyncMock = vi.fn();
    (useSendCalls as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'pending',
      writeContractsAsync: writeContractsAsyncMock,
    });
    (useCapabilitiesSafe as ReturnType<typeof vi.fn>).mockReturnValue({
      atomicBatch: { supported: true },
      paymasterService: { supported: true },
      auxiliaryFunds: { supported: true },
    });
    render(
      <TransactionProvider chainId={base.id} calls={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusName')
          .textContent,
      ).toBe('transactionPending');
    });
  });

  it('should set setLifecycleStatus to transactionPending when writeContractAsync is pending', async () => {
    const writeContractsAsyncMock = vi.fn();
    (useSendCall as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'pending',
      writeContractsAsync: writeContractsAsyncMock,
    });
    render(
      <TransactionProvider chainId={base.id} calls={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(
        screen.getByTestId('context-value-lifecycleStatus-statusName')
          .textContent,
      ).toBe('transactionPending');
    });
  });

  it('should update context on handleSubmit', async () => {
    const sendWalletTransactionsMock = vi.fn();
    (useCapabilitiesSafe as ReturnType<typeof vi.fn>).mockReturnValue({
      atomicBatch: { supported: true },
      paymasterService: { supported: true },
      auxiliaryFunds: { supported: true },
    });
    (useSendWalletTransactions as ReturnType<typeof vi.fn>).mockReturnValue(
      sendWalletTransactionsMock,
    );
    render(
      <TransactionProvider
        chainId={base.id}
        calls={[
          {
            to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
            data: '0x' as `0x${string}`,
          },
        ]}
      >
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(sendWalletTransactionsMock).toHaveBeenCalled();
    });
  });

  it('should handle errors during submission', async () => {
    const writeContractsAsyncMock = vi
      .fn()
      .mockRejectedValue(new Error('Test error'));
    (useSendCalls as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      writeContractsAsync: writeContractsAsyncMock,
    });
    (useCapabilitiesSafe as ReturnType<typeof vi.fn>).mockReturnValue({
      atomicBatch: { supported: true },
      paymasterService: { supported: true },
      auxiliaryFunds: { supported: true },
    });
    render(
      <TransactionProvider chainId={base.id} calls={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByTestId('context-value-errorCode').textContent).toBe(
        'TmTPc03',
      );
      expect(screen.getByTestId('context-value-errorMessage').textContent).toBe(
        'Something went wrong. Please try again.',
      );
    });
  });

  it('should switch chains when required', async () => {
    const switchChainAsyncMock = vi.fn();
    (useSwitchChain as ReturnType<typeof vi.fn>).mockReturnValue({
      switchChainAsync: switchChainAsyncMock,
    });
    render(
      <TransactionProvider chainId={2} calls={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(switchChainAsyncMock).toHaveBeenCalled();
    });
  });

  it('should display toast on error', async () => {
    (useSendCalls as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      writeContractsAsync: vi.fn().mockRejectedValue(new Error('Test error')),
    });
    render(
      <TransactionProvider chainId={base.id} calls={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      const testComponent = screen.getByTestId('context-value-isToastVisible');
      expect(testComponent.textContent).toBe('true');
    });
  });

  it('should handle user rejected request', async () => {
    const writeContractsAsyncMock = vi
      .fn()
      .mockRejectedValue({ cause: { name: 'UserRejectedRequestError' } });
    const sendWalletTransactionsMock = vi.fn().mockRejectedValue({
      cause: { name: 'UserRejectedRequestError' },
    });
    (useSendCalls as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'idle',
      writeContractsAsync: writeContractsAsyncMock,
    });
    (useSendWalletTransactions as ReturnType<typeof vi.fn>).mockReturnValue(
      sendWalletTransactionsMock,
    );
    (useCapabilitiesSafe as ReturnType<typeof vi.fn>).mockReturnValue({
      atomicBatch: { supported: true },
      paymasterService: { supported: true },
      auxiliaryFunds: { supported: true },
    });
    render(
      <TransactionProvider chainId={base.id} calls={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      const errorMessage = screen.getByTestId('context-value-errorMessage');
      expect(errorMessage.textContent).toBe('Request denied.');
    });
  });

  it('should handle chain switching', async () => {
    const switchChainAsyncMock = vi.fn();
    (useSwitchChain as ReturnType<typeof vi.fn>).mockReturnValue({
      switchChainAsync: switchChainAsyncMock,
    });
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({ chainId: 1 });
    render(
      <TransactionProvider chainId={2} calls={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(switchChainAsyncMock).toHaveBeenCalledWith({ chainId: 2 });
    });
  });

  it('should set transactions based on contracts', async () => {
    const contracts = [
      {
        to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
        data: '0x' as `0x${string}`,
      },
    ];
    render(
      <TransactionProvider chainId={base.id} calls={contracts}>
        <TestComponent />
      </TransactionProvider>,
    );
    await waitFor(() => {
      const transactionsElement = screen.getByTestId('transactions');
      expect(transactionsElement.textContent).toBe(JSON.stringify(contracts));
    });
  });

  it('should set transactions based on calls', async () => {
    const calls = [
      {
        to: '0x4567890123456789012345678901234567890123' as `0x${string}`,
        data: '0xabcdef' as `0x${string}`,
      },
    ];
    render(
      <TransactionProvider chainId={base.id} calls={calls}>
        <TestComponent />
      </TransactionProvider>,
    );
    await waitFor(() => {
      const transactionsElement = screen.getByTestId('transactions');
      expect(transactionsElement.textContent).toBe(JSON.stringify(calls));
    });
  });

  it('should throw an error when calls are not provided', async () => {
    const restore = silenceError();
    expect(() => {
      render(
        <TransactionProvider chainId={base.id}>
          <div>Test</div>
        </TransactionProvider>,
      );
    }).toThrowError(
      'Transaction: calls or contracts must be provided as a prop to the Transaction component.',
    );
    restore();
  });

  it('should throw an error when used outside of TransactionProvider', () => {
    const TestComponent = () => {
      useTransactionContext();
      return null;
    };
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {}); // Suppress error logging
    expect(() => render(<TestComponent />)).toThrow(
      'useTransactionContext must be used within a Transaction component',
    );
    consoleError.mockRestore();
  });

  it('should throw an error when both contracts and calls are provided', async () => {
    const restore = silenceError();
    expect(() => {
      render(
        <TransactionProvider
          chainId={base.id}
          contracts={[
            {
              to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
              data: '0x' as `0x${string}`,
            },
          ]}
          calls={[
            {
              to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
              data: '0x' as `0x${string}`,
            },
          ]}
        >
          <div>Test</div>
        </TransactionProvider>,
      );
    }).toThrowError(
      'Transaction: Only one of contracts or calls can be provided as a prop to the Transaction component.',
    );
    restore();
  });

  it('should handle sponsored contract calls', async () => {
    const contracts = [
      { to: '0alissa' as `0x${string}`, data: '0x' as `0x${string}` },
    ];
    const mockCapabilities = {
      paymasterService: { url: 'http://example.com' },
    };
    (useOnchainKit as Mock).mockReturnValue({
      config: { paymaster: 'http://example.com' },
    });
    (useCapabilitiesSafe as ReturnType<typeof vi.fn>).mockReturnValue({
      atomicBatch: { supported: true },
      paymasterService: { supported: true },
      auxiliaryFunds: { supported: true },
    });
    const mockWriteContractsAsync = vi.fn().mockResolvedValue({});
    (useSendCalls as Mock).mockReturnValue({
      status: 'success',
      writeContractsAsync: mockWriteContractsAsync,
    });
    render(
      <TransactionProvider
        chainId={base.id}
        isSponsored={true}
        calls={contracts}
      >
        <TestComponent />
      </TransactionProvider>,
    );
    fireEvent.click(screen.getByText('Submit'));
    expect(useSendWalletTransactions).toHaveBeenLastCalledWith(
      expect.objectContaining({
        capabilities: mockCapabilities,
      }),
    );
  });

  describe('analytics', () => {
    it('tracks transaction initiation', async () => {
      const mockTransactions = [
        {
          to: '0x1234567890123456789012345678901234567890' as `0x${string}`,
          data: '0x' as `0x${string}`,
          functionName: 'test',
        },
      ];

      (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
        address: '0xUserAddress',
        chainId: 1,
      });

      render(
        <TransactionProvider chainId={base.id} calls={mockTransactions}>
          <TestComponent />
        </TransactionProvider>,
      );

      const button = screen.getByText('Submit');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockSendAnalytics).toHaveBeenCalledWith(
          TransactionEvent.TransactionInitiated,
          {
            address: '0xUserAddress',
          },
        );
      });
    });

    it('tracks transaction success', async () => {
      (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
        address: '0xUserAddress',
        chainId: 1,
      });

      (
        useWaitForTransactionReceipt as ReturnType<typeof vi.fn>
      ).mockReturnValue({
        data: {
          status: 'success',
          transactionHash: '0xSuccessHash',
        },
      });

      (useOnchainKit as Mock).mockReturnValue({
        config: { paymaster: 'http://example.com' },
      });

      render(
        <TransactionProvider chainId={base.id} calls={[]} isSponsored={true}>
          <TestComponent />
        </TransactionProvider>,
      );

      const button = screen.getByText('Submit');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockSendAnalytics).toHaveBeenCalledWith(
          TransactionEvent.TransactionSuccess,
          {
            paymaster: true,
            address: '0xUserAddress',
            transactionHash: '0xSuccessHash',
          },
        );
      });
    });

    it('tracks transaction failure', async () => {
      (
        useWaitForTransactionReceipt as ReturnType<typeof vi.fn>
      ).mockReturnValue({
        data: {
          status: 'reverted',
          transactionHash: '0xFailHash',
        },
      });

      render(
        <TransactionProvider chainId={base.id} calls={[]}>
          <TestComponent />
        </TransactionProvider>,
      );

      const button = screen.getByText('setLifecycleStatus.error');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockSendAnalytics).toHaveBeenCalledWith(
          TransactionEvent.TransactionFailure,
          {
            error: 'Transaction failed',
            metadata: {
              code: '',
            },
          },
        );
      });
    
  it('should reset state after specified resetAfter time', async () => {
    vi.useFakeTimers();
    const resetAfter = 1000;
    // Mock receipt to trigger reset logic
    (useWaitForTransactionReceipt as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { status: 'success' },
    });
    (useSendCall as ReturnType<typeof vi.fn>).mockReturnValue({
      data: '0xhash12345678',
      reset: vi.fn(),
    });

    render(
      <TransactionProvider chainId={base.id} calls={[]} resetAfter={resetAfter}>
        <TestComponent />
      </TransactionProvider>,
    );

    // Trigger a transaction to get into success state
    fireEvent.click(screen.getByText('Submit'));

    // Verify initial success state
    expect(
      screen.getByTestId('context-value-lifecycleStatus-statusName')
        .textContent,
    ).toBe('success');

    // Fast forward past resetAfter time
    vi.advanceTimersByTime(resetAfter + 100);

    // Verify reset was called
    expect(useSendCall().reset).toHaveBeenCalled();

    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it('should cleanup resetAfter timeout on unmount', async () => {
    vi.useFakeTimers();
    const resetAfter = 1000;

    // Mock receipt to trigger reset logic
    (useWaitForTransactionReceipt as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { status: 'success' },
    });

    const { unmount } = render(
      <TransactionProvider chainId={base.id} calls={[]} resetAfter={resetAfter}>
        <TestComponent />
      </TransactionProvider>,
    );

    // Trigger a transaction
    fireEvent.click(screen.getByText('Submit'));

    // Unmount before timer completes
    unmount();

    // Advance timers - this shouldn't cause any errors
    vi.advanceTimersByTime(resetAfter + 100);

    vi.useRealTimers();
  });
});

    it('does not track analytics for user rejected transactions', async () => {
      const sendWalletTransactionsMock = vi.fn().mockRejectedValue({
        cause: { name: 'UserRejectedRequestError' },
      });
      (useSendWalletTransactions as ReturnType<typeof vi.fn>).mockReturnValue(
        sendWalletTransactionsMock,
      );

      render(
        <TransactionProvider chainId={base.id} calls={[]}>
          <TestComponent />
        </TransactionProvider>,
      );

      const button = screen.getByText('Submit');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockSendAnalytics).toHaveBeenCalledTimes(1);
        expect(mockSendAnalytics).not.toHaveBeenCalledWith(
          TransactionEvent.TransactionFailure,
          expect.any(Object),
        );
      });
    });
  });
});
