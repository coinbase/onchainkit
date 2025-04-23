import { MOCK_EARN_CONTEXT } from '@/earn/mocks/mocks.test';
import type { EarnContextType } from '@/earn/types';
import type { MakeRequired } from '@/internal/types';
import type { Call } from '@/transaction/types';
import { render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { EarnWithdraw } from './EarnWithdraw';

// Address required to avoid connect wallet prompt
const baseContext: MakeRequired<EarnContextType, 'recipientAddress'> = {
  ...MOCK_EARN_CONTEXT,
  recipientAddress: '0x123' as Address,
};

vi.mock('wagmi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('wagmi')>();
  return {
    ...actual,
    WagmiProvider: vi.fn(),
    createConfig: vi.fn(),
    useAccount: () => ({ address: '0x123', status: 'connected' }),
    useConnect: vi.fn(),
  };
});

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/transaction', () => ({
  Transaction: ({
    className,
    calls,
    children,
  }: {
    className: string;
    calls: Call[];
    children: React.ReactNode;
  }) => (
    <div
      data-testid="transaction"
      className={className}
      data-calls={JSON.stringify(calls)}
    >
      {children}
    </div>
  ),
  TransactionButton: ({ text }: { text: string }) => (
    <button data-testid="transaction-button" type="button">
      {text}
    </button>
  ),
}));

describe('EarnWithdraw Component', () => {
  beforeEach(() => {
    vi.mocked(useEarnContext).mockReturnValue(baseContext);
  });

  it('renders children when provided', () => {
    const mockChildren = <p>Custom Children</p>;
    render(<EarnWithdraw>{mockChildren}</EarnWithdraw>);

    const earnCard = screen.getByTestId('ockEarnCard');
    expect(earnCard).toBeInTheDocument();
    expect(earnCard).toHaveTextContent('Custom Children');
  });

  it('renders default components when children are not provided', () => {
    render(<EarnWithdraw />);

    const earnCard = screen.getByTestId('ockEarnCard');
    expect(earnCard).toBeInTheDocument();

    expect(screen.getByTestId('ockEarnDetails')).toBeInTheDocument();
    expect(screen.getByTestId('ockEarnAmountInput')).toBeInTheDocument();
    expect(screen.getByTestId('ockEarnBalance')).toBeInTheDocument();
  });

  it('applies custom className to the EarnCard', () => {
    const customClass = 'custom-class';
    render(<EarnWithdraw className={customClass} />);

    const earnCard = screen.getByTestId('ockEarnCard');
    expect(earnCard).toHaveClass(customClass);
  });
});
