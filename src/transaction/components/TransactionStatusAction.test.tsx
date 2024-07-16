import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionStatusAction } from './TransactionStatusAction';
import { useGetTransactionStatus } from '../core/useGetTransactionStatus';

vi.mock('../core/useGetTransactionStatus', () => ({
  useGetTransactionStatus: vi.fn(),
}));

describe('TransactionStatusAction', () => {
  it('renders transaction status action', () => {
    (useGetTransactionStatus as vi.Mock).mockReturnValue({
      actionElement: <button>Retry</button>,
    });

    render(<TransactionStatusAction className="custom-class" />);

    const actionElement = screen.getByText('Retry');
    expect(actionElement).toBeInTheDocument();
    expect(actionElement.tagName).toBe('BUTTON');
  });
});
