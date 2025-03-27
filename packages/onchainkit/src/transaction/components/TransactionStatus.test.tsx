import { render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useGetTransactionStatusAction } from '../hooks/useGetTransactionStatusAction';
import { useGetTransactionStatusLabel } from '../hooks/useGetTransactionStatusLabel';
import { TransactionStatus } from './TransactionStatus';

vi.mock('../hooks/useGetTransactionStatusLabel', () => ({
  useGetTransactionStatusLabel: vi.fn(),
}));

vi.mock('../hooks/useGetTransactionStatusAction', () => ({
  useGetTransactionStatusAction: vi.fn(),
}));

describe('TransactionStatus', () => {
  it('renders children correctly', () => {
    render(
      <TransactionStatus className="custom-class">
        <span>Transaction Status Content</span>
      </TransactionStatus>,
    );

    const contentElement = screen.getByText('Transaction Status Content');
    expect(contentElement).toBeInTheDocument();
    expect(contentElement.parentElement).toHaveClass(
      'flex justify-between custom-class',
    );
  });

  it('renders default children correctly', () => {
    (useGetTransactionStatusLabel as Mock).mockReturnValue({
      label: 'Successful!',
      labelClassName: 'ock-text-foreground-muted',
    });

    (useGetTransactionStatusAction as Mock).mockReturnValue({
      actionElement: <button type="button">Try again</button>,
    });

    render(<TransactionStatus className="custom-class" />);

    expect(screen.getByText('Successful!')).toBeInTheDocument();
  });
});
