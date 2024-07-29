import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Transaction } from './Transaction';

vi.mock('./TransactionProvider', () => ({
  TransactionProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('Transaction', () => {
  it('renders the children inside the TransactionProvider', () => {
    render(
      <Transaction
        address="0x123"
        capabilities={{}}
        chainId={123}
        className="test-class"
        contracts={[]}
        onError={vi.fn()}
        onSuccess={vi.fn()}
      >
        <div>Test Child</div>
      </Transaction>,
    );

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('applies the correct className', () => {
    render(
      <Transaction
        address="0x123"
        capabilities={{}}
        chainId={123}
        className="test-class"
        contracts={[]}
        onError={vi.fn()}
        onSuccess={vi.fn()}
      >
        <div>Test Child</div>
      </Transaction>,
    );

    // Checking if the div has the correct classes applied
    const container = screen.getByText('Test Child').parentElement;
    expect(container).toHaveClass('test-class');
  });
});
