import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTransactionContext } from './TransactionProvider';
import { TransactionToast } from './TransactionToast';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionToast', () => {
  it('renders children correctly', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      isLoading: true,
      isToastVisible: true,
    });

    render(
      <TransactionToast className="custom-class">
        <span>Transaction Toast Content</span>
      </TransactionToast>,
    );

    const contentElement = screen.getByText('Transaction Toast Content');
    expect(contentElement).toBeInTheDocument();
  });
});
