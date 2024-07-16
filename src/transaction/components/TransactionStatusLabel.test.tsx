import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionStatusLabel } from './TransactionStatusLabel';
import { useGetTransactionStatus } from '../core/useGetTransactionStatus';

vi.mock('../core/useGetTransactionStatus', () => ({
  useGetTransactionStatus: vi.fn(),
}));

describe('TransactionStatusLabel', () => {
  it('renders transaction status label', () => {
    (useGetTransactionStatus as vi.Mock).mockReturnValue({
      label: 'Successful!',
      labelClassName: 'text-foreground-muted',
    });

    render(<TransactionStatusLabel className="custom-class" />);

    const label = screen.getByText('Successful!');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-foreground-muted');
  });
});