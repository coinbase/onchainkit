import { render, fireEvent } from '@testing-library/react';
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

  // it('should handle submit correctly', async () => {
  //   const writeContractsMock = vi.fn();
  //   vi.mocked(require('../hooks/useWriteContracts').useWriteContracts).mockReturnValue({
  //     status: 'idle',
  //     writeContracts: writeContractsMock,
  //   });

  //   const TestComponent: React.FC = () => {
  //     const { onSubmit } = useTransactionContext();
  //     return <button onClick={onSubmit}>Submit</button>;
  //   };

  //   const { getByText } = render(
  //     <TransactionProvider address="0x123" contracts={[{ id: 1 }]} onError={() => {}}>
  //       <TestComponent />
  //     </TransactionProvider>,
  //   );

  //   fireEvent.click(getByText('Submit'));
  //   expect(writeContractsMock).toHaveBeenCalled();
  // });

  // it('should set error message correctly', () => {
  //   const TestComponent: React.FC = () => {
  //     const { setErrorMessage, errorMessage } = useTransactionContext();
  //     return (
  //       <div>
  //         <button onClick={() => setErrorMessage('Error occurred')}>Set Error</button>
  //         <span>{errorMessage}</span>
  //       </div>
  //     );
  //   };

  //   const { getByText } = render(
  //     <TransactionProvider address="0x123" contracts={[]} onError={() => {}}>
  //       <TestComponent />
  //     </TransactionProvider>,
  //   );

  //   fireEvent.click(getByText('Set Error'));
  //   expect(getByText('Error occurred')).toBeDefined();
  // });

  // it('should set toast visibility correctly', () => {
  //   const TestComponent: React.FC = () => {
  //     const { setIsToastVisible, isToastVisible } = useTransactionContext();
  //     return (
  //       <div>
  //         <button onClick={() => setIsToastVisible(true)}>Show Toast</button>
  //         {isToastVisible && <span>Toast is visible</span>}
  //       </div>
  //     );
  //   };

  //   const { getByText } = render(
  //     <TransactionProvider address="0x123" contracts={[]} onError={() => {}}>
  //       <TestComponent />
  //     </TransactionProvider>,
  //   );

  //   fireEvent.click(getByText('Show Toast'));
  //   expect(getByText('Toast is visible')).toBeDefined();
  // });
});
