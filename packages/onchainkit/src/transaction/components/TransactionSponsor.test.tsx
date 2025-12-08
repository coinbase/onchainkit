import { render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useTransactionContext } from './TransactionProvider';
import { TransactionSponsor } from './TransactionSponsor';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionSponsor', () => {
  it('should render correctly', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      paymasterUrl: 'paymasterUrl',
    });
    render(<TransactionSponsor />);
    const element = screen.getByText('Zero transaction fee');
    expect(element).toBeInTheDocument();
  });

  it('should not render if paymasterUrl is null', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      paymasterUrl: null,
    });
    render(<TransactionSponsor />);
    expect(screen.queryByText('Zero transaction fee')).not.toBeInTheDocument();
  });

  it('should not render if statusName is not init', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'blah', statusData: null },
      paymasterUrl: null,
    });
    render(<TransactionSponsor />);
    expect(screen.queryByText('Zero transaction fee')).not.toBeInTheDocument();
  });

  it('should render if statusName is init', () => {
    (useTransactionContext as Mock).mockReturnValue({
      lifecycleStatus: { statusName: 'init', statusData: null },
      paymasterUrl: 'paymasterUrl',
    });
    render(<TransactionSponsor />);
    const element = screen.getByText('Zero transaction fee');
    expect(element).toBeInTheDocument();
  });
});
