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
  return (
    <div data-testid="test-component">
      <button type="button" onClick={context.onSubmit}>
        Submit
      </button>
      <span data-testid="context-value">{JSON.stringify(context)}</span>
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

  it('should update context on handleSubmit', async () => {
    const writeContractsAsyncMock = vi.fn();
    (useWriteContracts as ReturnType<typeof vi.fn>).mockReturnValue({
      statusWriteContracts: 'IDLE',
      writeContractsAsync: writeContractsAsyncMock,
    });

    render(
      <TransactionProvider address="0x123" contracts={[]} onError={() => {}}>
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
        onError={() => {}}
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
      <TransactionProvider address="0x123" contracts={[]} onError={() => {}}>
        <TestComponent />
      </TransactionProvider>,
    );

    const button = screen.getByText('Submit');
    fireEvent.click(button);

    await waitFor(() => {
      const testComponent = screen.getByTestId('context-value');
      const updatedContext = JSON.parse(testComponent.textContent || '{}');
      expect(updatedContext.errorMessage).toBe(
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
