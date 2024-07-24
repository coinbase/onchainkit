import { render, waitFor } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWriteContract } from '../hooks/useWriteContract';
import { useWriteContracts } from '../hooks/useWriteContracts';
import type { TransactionContextType } from '../types';
import {
  TransactionProvider,
  useTransactionContext,
} from './TransactionProvider';

vi.mock('../hooks/useWriteContracts', () => ({
  useWriteContracts: vi.fn(() => ({ status: 'idle', writeContracts: vi.fn() })),
  genericErrorMessage: 'Something went wrong. Please try again.',
}));

vi.mock('../hooks/useWriteContract', () => ({
  useWriteContract: vi.fn(() => ({
    status: 'idle',
    writeContract: vi.fn(),
    data: null,
  })),
}));

vi.mock('../hooks/useCallsStatus', () => ({
  useCallsStatus: vi.fn(() => ({ transactionHash: null })),
}));

vi.mock('../../internal/hooks/useValue', () => ({
  useValue: vi.fn((value) => value),
}));

const mockUseWriteContracts = vi.mocked(useWriteContracts);
const mockUseWriteContract = vi.mocked(useWriteContract);

describe('TransactionProvider', () => {
  let providedContext: TransactionContextType | undefined;

  const TestComponent: React.FC = () => {
    const context = useTransactionContext();
    providedContext = context;
    return null;
  };

  beforeEach(() => {
    providedContext = undefined;
    vi.clearAllMocks();
  });

  it('should provide the transaction context to its children', () => {
    render(
      <TransactionProvider address="0x123" contracts={[]} onError={() => {}}>
        <TestComponent />
      </TransactionProvider>,
    );

    expect(providedContext).toBeDefined();
    if (providedContext) {
      expect(providedContext.address).toBe('0x123');
      expect(providedContext.contracts).toEqual([]);
      expect(providedContext.isLoading).toBe(false);
      expect(providedContext.status).toBe('idle');
      expect(providedContext.transactionHash).toBeNull();
      expect(typeof providedContext.onSubmit).toBe('function');
      expect(typeof providedContext.setErrorMessage).toBe('function');
      expect(typeof providedContext.setIsToastVisible).toBe('function');
      expect(typeof providedContext.setTransactionId).toBe('function');
    }
  });

  it('should call writeContracts on onSubmit', async () => {
    const mockWriteContracts = vi.fn();
    mockUseWriteContracts.mockReturnValue({
      status: 'idle',
      writeContracts: mockWriteContracts,
    });

    const testContracts = [{ foo: 'bar' }]; // TODO: Update to more realistic values
    render(
      <TransactionProvider
        address="0x123"
        contracts={testContracts}
        onError={() => {}}
      >
        <TestComponent />
      </TransactionProvider>,
    );

    await providedContext?.onSubmit();

    await waitFor(() => {
      expect(mockWriteContracts).toHaveBeenCalledWith({
        contracts: testContracts,
      });
    });
  });

  it('should fallback to writeContract for EOA accounts', async () => {
    const mockWriteContracts = vi.fn().mockResolvedValue(undefined);
    const mockWriteContract = vi.fn();
    mockUseWriteContracts.mockReturnValue({
      status: 'idle',
      writeContracts: mockWriteContracts,
    });
    mockUseWriteContract.mockReturnValue({
      status: 'idle',
      writeContract: mockWriteContract,
      data: null,
    });

    const testContracts = [{ foo: 'bar' }, { blah: 'test' }]; // Get real data
    render(
      <TransactionProvider
        address="0x123"
        contracts={testContracts}
        onError={() => {}}
      >
        <TestComponent />
      </TransactionProvider>,
    );

    await providedContext?.onSubmit();

    await waitFor(() => {
      expect(mockWriteContracts).toHaveBeenCalledWith({
        contracts: testContracts,
      });
    });

    await waitFor(() => {
      expect(mockWriteContract).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(mockWriteContract).toHaveBeenNthCalledWith(1, { foo: 'bar' }); // update
      expect(mockWriteContract).toHaveBeenNthCalledWith(2, { blah: 'test' }); // update
    });
  });

  it('should set error message on failure', async () => {
    const mockWriteContracts = vi
      .fn()
      .mockRejectedValue(new Error('Test error'));
    mockUseWriteContracts.mockReturnValue({
      status: 'idle',
      writeContracts: mockWriteContracts,
    });

    render(
      <TransactionProvider address="0x123" contracts={[]} onError={() => {}}>
        <TestComponent />
      </TransactionProvider>,
    );

    await providedContext?.onSubmit();

    await waitFor(() => {
      expect(providedContext?.errorMessage).toBe(
        'Something went wrong. Please try again.',
      );
    });
  });
});
