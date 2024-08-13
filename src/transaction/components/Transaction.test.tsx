import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Transaction } from './Transaction';
import { TransactionProvider } from './TransactionProvider';

vi.mock('./TransactionProvider', () => ({
  TransactionProvider: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )),
}));

describe('Transaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders the children inside the TransactionProvider', () => {
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

  it('should applies the correct className', () => {
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

  it('should call TransactionProvider', () => {
    const onError = vi.fn();
    const onStatus = vi.fn();
    const onSuccess = vi.fn();
    render(
      <Transaction
        address="0x123"
        capabilities={{}}
        chainId={123}
        className="test-class"
        contracts={[]}
        onError={onError}
        onStatus={onStatus}
        onSuccess={onSuccess}
      >
        <div>Test Child</div>
      </Transaction>,
    );
    // Checking if the TransactionProvider is called
    expect(TransactionProvider).toHaveBeenCalledTimes(1);
  });
});
