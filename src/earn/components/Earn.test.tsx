import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConfig } from 'wagmi';
import { Earn } from './Earn';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConfig: vi.fn(),
  useCapabilities: vi.fn(),
}));

vi.mock('@/transaction', () => ({
  Transaction: ({ className, calls, children }: any) => (
    <div
      data-testid="transaction"
      className={className}
      data-calls={JSON.stringify(calls)}
    >
      {children}
    </div>
  ),
  TransactionButton: ({ text }: { text: string }) => (
    <button data-testid="transaction-button">{text}</button>
  ),
}));

vi.mock('@/wallet/hooks/useGetTokenBalance', () => ({
  useGetTokenBalance: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('Earn Component', () => {
  beforeEach(() => {
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
    (useGetTokenBalance as Mock).mockReturnValue({
      convertedBalance: '0.0',
      error: null,
    });
    (useConfig as Mock).mockReturnValue({});
  });

  it('renders custom children when provided', () => {
    const customChildren = <p>Custom Children</p>;
    render(<Earn vaultAddress="0x123">{customChildren}</Earn>);

    expect(screen.getByText('Custom Children')).toBeInTheDocument();
    expect(screen.queryByTestId('tabs')).not.toBeInTheDocument();
  });

  it('renders default tabs and their contents when children are not provided', () => {
    const { container } = render(<Earn vaultAddress="0x123" />);

    const tabs = screen.getByTestId('ockTabs');
    expect(tabs).toBeInTheDocument();

    expect(container).toHaveTextContent('Deposit');
    expect(container).toHaveTextContent('Withdraw');
  });
});
