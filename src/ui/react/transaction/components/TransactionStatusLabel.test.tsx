import { useGetTransactionStatusLabel } from '@/core-react/transaction/hooks/useGetTransactionStatusLabel';
import { render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { TransactionStatusLabel } from './TransactionStatusLabel';

vi.mock('@/core-react/transaction/hooks/useGetTransactionStatusLabel', () => ({
  useGetTransactionStatusLabel: vi.fn(),
}));

describe('TransactionStatusLabel', () => {
  it('renders transaction status label', () => {
    (useGetTransactionStatusLabel as Mock).mockReturnValue({
      label: 'Successful!',
      labelClassName: 'ock-text-foreground-muted',
    });

    render(<TransactionStatusLabel className="custom-class" />);

    const label = screen.getByText('Successful!');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('ock-text-foreground-muted');
  });
});
