import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TransactionToastAction } from './TransactionToastAction';
import { useGetTransactionToast } from '../hooks/useGetTransactionToast';

vi.mock('../hooks/useGetTransactionToast', () => ({
  useGetTransactionToast: vi.fn(),
}));

describe('TransactionToastAction', () => {
  it('renders transaction status action', () => {
    (useGetTransactionToast as vi.Mock).mockReturnValue({
      actionElement: <button type="button">Try again</button>,
    });

    render(<TransactionToastAction className="custom-class" />);

    const actionElement = screen.getByText('Try again');
    expect(actionElement).toBeInTheDocument();
    expect(actionElement.tagName).toBe('BUTTON');
  });
});
