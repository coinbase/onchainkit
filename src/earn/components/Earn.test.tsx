import { useGetTokenBalance } from '@/wallet/hooks/useGetTokenBalance';
import { render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { Earn } from './Earn';

vi.mock('wagmi', async (importOriginal) => {
  return {
    ...(await importOriginal<typeof import('wagmi')>()),
    useAccount: vi.fn(),
  };
});

vi.mock('@/internal', () => ({
  Tabs: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ockTabs">{children}</div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  Tab: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <button data-testid={`tab-${value}`}>{children}</button>
  ),
  TabContent: ({
    value,
    children,
  }: {
    value: string;
    children: React.ReactNode;
  }) => <div data-testid={`tab-content-${value}`}>{children}</div>,
}));

vi.mock('@/wallet/hooks/useGetTokenBalance', () => ({
  useGetTokenBalance: vi.fn(),
}));

vi.mock('@/core-react/internal/hooks/useTheme', () => ({
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
