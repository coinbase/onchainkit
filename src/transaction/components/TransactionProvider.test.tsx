import { render } from '@testing-library/react';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { TransactionContextType } from '../types';
import {
  TransactionProvider,
  useTransactionContext,
} from './TransactionProvider';

vi.mock('../hooks/useWriteContracts', () => ({
  useWriteContracts: vi.fn(() => ({ status: 'idle', writeContracts: vi.fn() })),
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

describe('TransactionProvider', () => {
  it('should provide the transaction context to its children', () => {
    let providedContext: TransactionContextType | undefined;

    const TestComponent: React.FC = () => {
      const context = useTransactionContext();
      providedContext = context;
      return null;
    };

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
});
