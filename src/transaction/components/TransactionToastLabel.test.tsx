import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useGetTransactionLabel } from '../hooks/useGetTransactionLabel';
import { TransactionToastLabel } from './TransactionToastLabel';

vi.mock('../hooks/useGetTransactionLabel', () => ({
  useGetTransactionLabel: vi.fn(),
}));

describe('TransactionToastLabel', () => {
  it('renders transaction status action', () => {
    (useGetTransactionLabel as vi.Mock).mockReturnValue({
      label: 'Successful',
    });

    render(<TransactionToastLabel className="custom-class" />);

    const labelElement = screen.getByText('Successful');
    expect(labelElement).toBeInTheDocument();
  });
});
