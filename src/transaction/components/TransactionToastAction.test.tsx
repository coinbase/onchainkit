import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useGetTransactionToastAction } from '../hooks/useGetTransactionToastAction';
import { TransactionToastAction } from './TransactionToastAction';

vi.mock('../hooks/useGetTransactionToastAction', () => ({
  useGetTransactionToastAction: vi.fn(),
}));

describe('TransactionToastAction', () => {
  it('renders transaction status action', () => {
    (useGetTransactionToastAction as vi.Mock).mockReturnValue({
      actionElement: <button type="button">Try again</button>,
    });

    render(<TransactionToastAction className="custom-class" />);

    const actionElement = screen.getByText('Try again');
    expect(actionElement).toBeInTheDocument();
    expect(actionElement.tagName).toBe('BUTTON');
  });
});
