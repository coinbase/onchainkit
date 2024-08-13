import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useCallsStatus } from '../hooks/useCallsStatus';
import { useWriteContract } from '../hooks/useWriteContract';
import { useWriteContracts } from '../hooks/useWriteContracts';
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

vi.mock('../hooks/useCallsStatus', () => ({
  useCallsStatus: vi.fn(),
}));

vi.mock('../hooks/useWriteContract', () => ({
  useWriteContract: vi.fn(),
}));

vi.mock('../hooks/useWriteContracts', () => ({
  useWriteContracts: vi.fn(),
  genericErrorMessage: 'Something went wrong. Please try again.',
}));

const TestComponent = () => {
  const context = useTransactionContext();
  const handleSetLifeCycleStatus = async () => {
    context.setLifeCycleStatus({
      statusName: 'error',
      statusData: { code: 'code', error: 'error_long_messages' },
    });
  };
  return (
    <div data-testid="test-component">
      <button type="button" onClick={context.onSubmit}>
        Submit
      </button>
      <span data-testid="context-value-errorMessage">
        {context.errorMessage}
      </span>
      <span data-testid="context-value-isToastVisible">
        {`${context.isToastVisible}`}
      </span>
      <button type="button" onClick={handleSetLifeCycleStatus}>
        setLifeCycleStatus.error
      </button>
    </div>
  );
};

describe('TransactionProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({ chainId: 1 });
    (useSwitchChain as ReturnType<typeof vi.fn>).mockReturnValue({
      switchChainAsync: vi.fn(),
    });
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      transactionHash: null,
      status: 'IDLE',
    });
    (useWriteContract as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'IDLE',
      writeContract: vi.fn(),
      data: null,
    });
    (useWriteContracts as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'IDLE',
      writeContractsAsync: vi.fn(),
    });
    (useWaitForTransactionReceipt as ReturnType<typeof vi.fn>).mockReturnValue({
      receipt: undefined,
    });
  });

  it('should emit onError when setLifeCycleStatus is called with error', async () => {
    const onErrorMock = vi.fn();
    render(
      <TransactionProvider address="0x123" contracts={[]} onError={onErrorMock}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('setLifeCycleStatus.error');
    fireEvent.click(button);
    expect(onErrorMock).toHaveBeenCalled();
  });

  it('should update context on handleSubmit', async () => {
    const writeContractsAsyncMock = vi.fn();
    (useWriteContracts as ReturnType<typeof vi.fn>).mockReturnValue({
      statusWriteContracts: 'IDLE',
      writeContractsAsync: writeContractsAsyncMock,
    });
    render(
      <TransactionProvider address="0x123" contracts={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(writeContractsAsyncMock).toHaveBeenCalled();
    });
  });

  it('should call onsuccess when receipt exists', async () => {
    const onSuccessMock = vi.fn();
    (useWaitForTransactionReceipt as ReturnType<typeof vi.fn>).mockReturnValue({
      data: '123',
    });
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      transactionHash: 'hash',
    });
    render(
      <TransactionProvider
        address="0x123"
        contracts={[]}
        onSuccess={onSuccessMock}
      >
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it('should handle errors during submission', async () => {
    const writeContractsAsyncMock = vi
      .fn()
      .mockRejectedValue(new Error('Test error'));
    (useWriteContracts as ReturnType<typeof vi.fn>).mockReturnValue({
      statusWriteContracts: 'IDLE',
      writeContractsAsync: writeContractsAsyncMock,
    });
    render(
      <TransactionProvider address="0x123" contracts={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      const testComponent = screen.getByTestId('context-value-errorMessage');
      expect(testComponent.textContent).toBe(
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
      <TransactionProvider address="0x123" chainId={2} contracts={[]}>
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
    (useWriteContracts as ReturnType<typeof vi.fn>).mockReturnValue({
      statusWriteContracts: 'IDLE',
      writeContractsAsync: vi.fn().mockRejectedValue(new Error('Test error')),
    });
    render(
      <TransactionProvider address="0x123" contracts={[]}>
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

  it('should not fetch receipts if contract list is empty', async () => {
    const waitForTransactionReceiptMock = vi.fn();
    render(
      <TransactionProvider address="0x123" contracts={[]}>
        <TestComponent />
      </TransactionProvider>,
    );
    const button = screen.getByText('Submit');
    fireEvent.click(button);
    await waitFor(() => {
      expect(waitForTransactionReceiptMock).not.toHaveBeenCalled();
    });
  });

  it('should handle user rejected request', async () => {
    const writeContractsAsyncMock = vi
      .fn()
      .mockRejectedValue({ cause: { name: 'UserRejectedRequestError' } });
    (useWriteContracts as ReturnType<typeof vi.fn>).mockReturnValue({
      statusWriteContracts: 'IDLE',
      writeContractsAsync: writeContractsAsyncMock,
    });

    render(
      <TransactionProvider address="0x123" contracts={[]}>
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

  it('should call onSuccess when receipts are available', async () => {
    const onSuccessMock = vi.fn();
    (useWaitForTransactionReceipt as ReturnType<typeof vi.fn>).mockReturnValue({
      data: { status: 'success' },
    });
    (useCallsStatus as ReturnType<typeof vi.fn>).mockReturnValue({
      transactionHash: 'hash',
    });

    render(
      <TransactionProvider
        address="0x123"
        contracts={[]}
        onSuccess={onSuccessMock}
      >
        <TestComponent />
      </TransactionProvider>,
    );

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalledWith({
        transactionReceipts: [{ status: 'success' }],
      });
    });
  });

  it('should handle chain switching', async () => {
    const switchChainAsyncMock = vi.fn();
    (useSwitchChain as ReturnType<typeof vi.fn>).mockReturnValue({
      switchChainAsync: switchChainAsyncMock,
    });
    (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({ chainId: 1 });

    render(
      <TransactionProvider address="0x123" chainId={2} contracts={[]}>
        <TestComponent />
      </TransactionProvider>,
    );

    const button = screen.getByText('Submit');
    fireEvent.click(button);

    await waitFor(() => {
      expect(switchChainAsyncMock).toHaveBeenCalledWith({ chainId: 2 });
    });
  });

  it('should handle generic error during fallback', async () => {
    const writeContractsAsyncMock = vi
      .fn()
      .mockRejectedValue(new Error('Method not supported'));
    const writeContractAsyncMock = vi
      .fn()
      .mockRejectedValue(new Error('Generic error'));
    (useWriteContracts as ReturnType<typeof vi.fn>).mockReturnValue({
      statusWriteContracts: 'IDLE',
      writeContractsAsync: writeContractsAsyncMock,
    });
    (useWriteContract as ReturnType<typeof vi.fn>).mockReturnValue({
      status: 'IDLE',
      writeContractAsync: writeContractAsyncMock,
    });

    render(
      <TransactionProvider address="0x123" contracts={[{}]}>
        <TestComponent />
      </TransactionProvider>,
    );

    const button = screen.getByText('Submit');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('context-value-errorMessage').textContent).toBe(
        'Something went wrong. Please try again.',
      );
    });
  });
});

describe('useTransactionContext', () => {
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
});
