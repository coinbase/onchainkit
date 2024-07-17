import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionGasFeeEstimate } from './TransactionGasFeeEstimate';
import { useTransactionContext } from './TransactionProvider';

vi.mock('./TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

describe('TransactionGasFeeEstimate', () => {
  it('renders gas fee if present', () => {
    (useTransactionContext as vi.Mock).mockReturnValue({ gasFee: '0.03' });

    render(<TransactionGasFeeEstimate />);

    const gasFeeElement = screen.getByText('0.03 ETH');
    expect(gasFeeElement).toBeInTheDocument();
  });

});
