import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTransactionContext } from './TransactionProvider';
import { TransactionSponsor } from './TransactionSponsor';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionSponsor', () => {
  it('renders correctly', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      statusWriteContract: 'idle',
      statusWriteContracts: 'idle',
      hasPaymaster: true,
    });
    render(<TransactionSponsor />);

    const element = screen.getByText('Free gas');
    expect(element).toBeInTheDocument();
  });
  it('renders correctly when provided sponsor name as prop', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      statusWriteContract: 'idle',
      statusWriteContracts: 'idle',
      hasPaymaster: true,
    });
    render(<TransactionSponsor text="Coinbase" />);

    const element = screen.getByText('Free gas');
    expect(element).toBeInTheDocument();
    const sponsor = screen.getByText('Coinbase');
    expect(sponsor).toBeInTheDocument();
  });
  it('does not render if hasPaymaster is false', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      statusWriteContract: 'idle',
      statusWriteContracts: 'idle',
      hasPaymaster: false,
    });
    render(<TransactionSponsor text="Coinbase" />);

    expect(screen.queryByText('Free gas')).not.toBeInTheDocument();
  });
});
