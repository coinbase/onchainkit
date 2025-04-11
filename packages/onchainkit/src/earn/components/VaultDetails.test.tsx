import { MOCK_EARN_CONTEXT } from '@/earn/mocks/mocks.test';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { beforeEach, describe, expect, it } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { VaultDetails } from './VaultDetails';

// Mock the context hook
vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('VaultDetails', () => {
  beforeEach(() => {
    // Reset mock before each test
    vi.mocked(useEarnContext).mockReturnValue(MOCK_EARN_CONTEXT);
  });

  it('renders skeleton when vault data is not available', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      // @ts-expect-error - This is a test
      vaultToken: null,
      // @ts-expect-error - This is a test
      vaultName: null,
    });

    render(<VaultDetails />);
    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('renders vault details with correct initial state', () => {
    render(<VaultDetails />);

    expect(screen.getByTestId('ock-vaultDetails')).toBeInTheDocument();
    expect(screen.getByTestId('ock-vaultDetailsButton')).toBeInTheDocument();
  });

  it('closes popover when onClose is triggered', () => {
    render(<VaultDetails />);

    fireEvent.click(screen.getByTestId('ock-vaultDetailsButton'));
    expect(screen.getByTestId('ock-vaultDetails')).toBeInTheDocument();

    const popover = screen.getByRole('dialog');
    fireEvent.keyDown(popover, { key: 'Escape' });

    expect(
      screen.queryByTestId('ock-vaultDetailsBaseScanLink'),
    ).not.toBeInTheDocument();
  });

  it('displays correct token information in popover', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      deposits: '10000',
      liquidity: '2000',
    });
    render(<VaultDetails />);

    fireEvent.click(screen.getByTestId('ock-vaultDetailsButton'));

    expect(screen.getByText('USDC')).toBeInTheDocument();
    expect(screen.getByText('10K USDC')).toBeInTheDocument(); // Deposits
    expect(screen.getByText('2K USDC')).toBeInTheDocument(); // Liquidity
  });

  it('renders BaseScan link with correct address', () => {
    render(<VaultDetails />);

    fireEvent.click(screen.getByTestId('ock-vaultDetailsButton'));

    const baseScanLink = screen.getByTestId('ock-vaultDetailsBaseScanLink');
    expect(baseScanLink).toHaveAttribute(
      'href',
      'https://basescan.org/address/0x123',
    );
    expect(baseScanLink).toHaveAttribute('target', '_blank');
    expect(baseScanLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles missing optional data gracefully', () => {
    vi.mocked(useEarnContext).mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      // @ts-expect-error - This is a test
      deposits: null,
      // @ts-expect-error - This is a test
      liquidity: null,
    });

    render(<VaultDetails />);

    fireEvent.click(screen.getByTestId('ock-vaultDetailsButton'));

    expect(screen.queryByText('Total deposits')).not.toBeInTheDocument();
    expect(screen.queryByText('Liquidity')).not.toBeInTheDocument();
  });
});
