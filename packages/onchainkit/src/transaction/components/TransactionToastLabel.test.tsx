import { render, screen } from '@testing-library/react';
import { type Mock, describe, expect, it, vi } from 'vitest';
import { useGetTransactionToastLabel } from '../hooks/useGetTransactionToastLabel';
import { TransactionToastLabel } from './TransactionToastLabel';

vi.mock('../hooks/useGetTransactionToastLabel', () => ({
  useGetTransactionToastLabel: vi.fn(),
}));

describe('TransactionToastLabel', () => {
  it('renders transaction status action', () => {
    (useGetTransactionToastLabel as Mock).mockReturnValue({
      label: 'Successful',
    });

    render(<TransactionToastLabel className="custom-class" />);

    const labelElement = screen.getByText('Successful');
    expect(labelElement).toBeInTheDocument();
  });
});
