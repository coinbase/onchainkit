import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useGetTransactionStatusAction } from '../hooks/useGetTransactionStatusAction';
import { TransactionStatusAction } from './TransactionStatusAction';

vi.mock('../hooks/useGetTransactionStatusAction', () => ({
  useGetTransactionStatusAction: vi.fn(),
}));

describe('TransactionStatusAction', () => {
  it('renders transaction status action', () => {
    (useGetTransactionStatusAction as vi.Mock).mockReturnValue({
      actionElement: <button type="button">Try again</button>,
    });

    render(<TransactionStatusAction className="custom-class" />);

    const actionElement = screen.getByText('Try again');
    expect(actionElement).toBeInTheDocument();
    expect(actionElement.tagName).toBe('BUTTON');
  });
});
