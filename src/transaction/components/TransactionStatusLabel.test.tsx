import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useGetTransactionLabel } from '../hooks/useGetTransactionLabel';
import { TransactionStatusLabel } from './TransactionStatusLabel';

vi.mock('../hooks/useGetTransactionLabel', () => ({
  useGetTransactionLabel: vi.fn(),
}));

describe('TransactionStatusLabel', () => {
  it('renders transaction status label', () => {
    (useGetTransactionLabel as vi.Mock).mockReturnValue({
      label: 'Successful!',
      labelClassName: 'text-ock-foreground-muted',
    });

    render(<TransactionStatusLabel className="custom-class" />);

    const label = screen.getByText('Successful!');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-ock-foreground-muted');
  });
});
