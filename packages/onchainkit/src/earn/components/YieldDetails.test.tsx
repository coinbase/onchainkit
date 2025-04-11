import { MOCK_EARN_CONTEXT } from '@/earn/mocks/mocks.test';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useEarnContext } from './EarnProvider';
import { YieldDetails } from './YieldDetails';

vi.mock('./EarnProvider', () => ({
  useEarnContext: vi.fn(),
}));

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('YieldDetails', () => {
  const mockUseEarnContext = useEarnContext as Mock;

  beforeEach(() => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      apy: '0.05',
      nativeApy: '0.05',
    });
  });

  it('shows loading skeleton when apy is not available', () => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      apy: undefined,
    });
    render(<YieldDetails />);
    expect(screen.getByTestId('ockSkeleton')).toBeInTheDocument();
  });

  it('displays APY with correct formatting', () => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      apy: '0.05',
    });

    render(<YieldDetails />);
    expect(screen.getByTestId('ock-yieldDetails')).toHaveTextContent(
      'APY 5.00%',
    );
  });

  it('opens popover when info button is clicked', () => {
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnNativeApy')).toBeInTheDocument();
  });

  it('displays native APY in popover', () => {
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnNativeApy')).toHaveTextContent('5.00%');
  });

  it('displays rewards in popover', () => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      apy: '0.05',
      nativeApy: '0.05',
      rewards: [
        {
          asset: '0x1',
          assetName: 'Reward 1',
          apy: '0.05',
        },
      ],
    });
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnRewards')).toHaveTextContent(
      'Reward 15.00%',
    );
  });

  it('handles empty rewards array', () => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      apy: '0.05',
      nativeApy: '0.05',
      rewards: [],
    });
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.queryByTestId('ock-earnRewards')).not.toBeInTheDocument();
  });

  it('handles null rewards', () => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      apy: '0.05',
      nativeApy: '0.05',
      rewards: null,
    });
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.queryByTestId('ock-earnRewards')).not.toBeInTheDocument();
  });

  it('displays performance fee in popover', () => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      apy: '0.05',
      nativeApy: '0.05',
      vaultFee: '0.01',
    });
    render(<YieldDetails />);
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnPerformanceFee')).toHaveTextContent(
      'Perf. Fee (1%)',
    );
    expect(screen.getByTestId('ock-earnPerformanceFee')).toHaveTextContent(
      '-0.05%',
    );
  });

  it('closes popover when onClose is triggered', () => {
    render(<YieldDetails />);
    // Open the popover first
    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.getByTestId('ock-earnNativeApy')).toBeInTheDocument();

    // Trigger onClose (simulating clicking outside or pressing escape)
    const popover = screen.getByRole('dialog');
    fireEvent.keyDown(popover, { key: 'Escape' });

    // Verify popover is closed
    expect(screen.queryByTestId('ock-earnNativeApy')).not.toBeInTheDocument();
  });

  it('handles missing native APY gracefully', () => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      apy: '0.05',
      nativeApy: undefined,
    });
    render(<YieldDetails />);

    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(screen.queryByTestId('ock-earnNativeApy')).not.toBeInTheDocument();
  });

  it('handles cases where vault fees are falsey', () => {
    mockUseEarnContext.mockReturnValue({
      ...MOCK_EARN_CONTEXT,
      apy: '0.05',
      nativeApy: '0.05',
      vaultFee: undefined,
    });
    render(<YieldDetails />);

    fireEvent.click(screen.getByTestId('ock-apyInfoButton'));
    expect(
      screen.queryByTestId('ock-earnPerformanceFee'),
    ).not.toBeInTheDocument();
  });
});
