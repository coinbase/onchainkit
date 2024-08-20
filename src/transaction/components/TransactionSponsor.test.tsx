import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTransactionContext } from './TransactionProvider';
import { TransactionSponsor } from './TransactionSponsor';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionSponsor', () => {
  it('should render correctly', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      lifeCycleStatus: { statusName: 'init', statusData: null },
      hasPaymaster: true,
    });
    render(<TransactionSponsor />);
    const element = screen.getByText('Zero transaction fee');
    expect(element).toBeInTheDocument();
  });

  it('should not render if hasPaymaster is false', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      lifeCycleStatus: { statusName: 'init', statusData: null },
      hasPaymaster: false,
    });
    render(<TransactionSponsor />);
    expect(screen.queryByText('Zero transaction fee')).not.toBeInTheDocument();
  });

  it('should not render if statusName is not init', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      lifeCycleStatus: { statusName: 'blah', statusData: null },
      hasPaymaster: false,
    });
    render(<TransactionSponsor />);
    expect(screen.queryByText('Zero transaction fee')).not.toBeInTheDocument();
  });

  it('should render if statusName is init', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({
      lifeCycleStatus: { statusName: 'init', statusData: null },
      hasPaymaster: true,
    });
    render(<TransactionSponsor />);
    const element = screen.getByText('Zero transaction fee');
    expect(element).toBeInTheDocument();
  });
});
