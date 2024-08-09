import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useGetTransactionAction } from '../hooks/useGetTransactionAction';
import { TransactionStatusAction } from './TransactionStatusAction';

vi.mock('../hooks/useGetTransactionAction', () => ({
  useGetTransactionAction: vi.fn(),
}));

describe('TransactionStatusAction', () => {
  it('renders transaction status action', () => {
    (useGetTransactionAction as vi.Mock).mockReturnValue({
      actionElement: <button type="button">Try again</button>,
    });

    render(<TransactionStatusAction className="custom-class" />);

    const actionElement = screen.getByText('Try again');
    expect(actionElement).toBeInTheDocument();
    expect(actionElement.tagName).toBe('BUTTON');
  });
});
