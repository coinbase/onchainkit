import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useGetTransactionToast } from '../hooks/useGetTransactionToast';
import { TransactionToastIcon } from './TransactionToastIcon';

vi.mock('../hooks/useGetTransactionToast', () => ({
  useGetTransactionToast: vi.fn(),
}));

describe('TransactionToastIcon', () => {
  it('renders transaction toast icon', () => {
    (useGetTransactionToast as vi.Mock).mockReturnValue({
      icon: <div>icon</div>,
    });

    render(<TransactionToastIcon className="custom-class" />);

    const iconElement = screen.getByText('icon');
    expect(iconElement).toBeInTheDocument();
  });
});
