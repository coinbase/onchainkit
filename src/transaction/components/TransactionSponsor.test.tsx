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
      statusSingle: 'idle',
      statusBatched: 'idle',
      hasPaymaster: true,
    });
    render(<TransactionSponsor />);

    const element = screen.getByText('Zero transaction fee');
    expect(element).toBeInTheDocument();
  });
  it('does not render if hasPaymaster is false', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      statusSingle: 'idle',
      statusBatched: 'idle',
      hasPaymaster: false,
    });
    render(<TransactionSponsor />);

    expect(screen.queryByText('Zero transaction fee')).not.toBeInTheDocument();
  });
});
