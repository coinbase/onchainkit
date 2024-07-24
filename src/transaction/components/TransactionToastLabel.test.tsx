import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useGetTransactionToast } from '../hooks/useGetTransactionToast';
import { TransactionToastLabel } from './TransactionToastLabel';

vi.mock('../hooks/useGetTransactionToast', () => ({
  useGetTransactionToast: vi.fn(),
}));

describe('TransactionToastLabel', () => {
  it('renders transaction status action', () => {
    (useGetTransactionToast as vi.Mock).mockReturnValue({
      label: 'Successful',
    });

    render(<TransactionToastLabel className="custom-class" />);

    const labelElement = screen.getByText('Successful');
    expect(labelElement).toBeInTheDocument();
  });
});
