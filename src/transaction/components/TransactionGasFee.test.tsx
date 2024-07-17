import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransactionGasFee } from './TransactionGasFee';
import { useTransactionContext } from './TransactionProvider';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionGasFee', () => {
  it('renders children correctly', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({ status: 'idle' });

    render(
      <TransactionGasFee className="custom-class">
        <span>Transaction Gas Fee Content</span>
      </TransactionGasFee>,
    );

    const contentElement = screen.getByText('Transaction Gas Fee Content');
    expect(contentElement).toBeInTheDocument();
  });
});
