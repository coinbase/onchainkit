import { BuyEvent } from '@/core/analytics/types';
import { openPopup } from '@/internal/utils/openPopup';
import { degenToken, ethToken, usdcToken } from '@/token/constants';
import { useOnchainKit } from '@/useOnchainKit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getBuyFundingUrl } from '../utils/getBuyFundingUrl';
import { BuyDropdown } from './BuyDropdown';
import { useBuyContext } from './BuyProvider';
import { sendOCKAnalyticsEvent } from '@/core/analytics/utils/sendAnalytics';

vi.mock('./BuyProvider', () => ({
  useBuyContext: vi.fn(),
}));

vi.mock('@/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('@/internal/utils/getRoundedAmount', () => ({
  getRoundedAmount: vi.fn(() => '10'),
}));

vi.mock('@/fund/utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(() => ({ height: 600, width: 400 })),
}));

vi.mock('../utils/getBuyFundingUrl', () => ({
  getBuyFundingUrl: vi.fn(() => 'valid-funding-url'),
}));

vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    useAccount: () => ({ address: '0xMockAddress' }),
  };
});

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('@/core/analytics/utils/sendAnalytics', () => ({
  sendOCKAnalyticsEvent: vi.fn(),
}));

const mockStartPopupMonitor = vi.fn();

const mockContextValue = {
  to: {
    token: degenToken,
    amount: '1.23',
    amountUSD: '123.45',
  },
  fromETH: { token: ethToken },
  fromUSDC: { token: usdcToken },
  from: { token: { symbol: 'DAI' } },
  startPopupMonitor: mockStartPopupMonitor,
  setIsDropdownOpen: vi.fn(),
};

describe('BuyDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useBuyContext as Mock).mockReturnValue({
      ...mockContextValue,
      fromETH: { token: ethToken, amount: '10' },
      fromUSDC: { token: usdcToken, amount: '10' },
      from: { token: { symbol: 'DAI' }, amount: '10' },
    });
    (useOnchainKit as Mock).mockReturnValue({
      projectId: 'mock-project-id',
    });
  });

  it('renders the dropdown with correct content', () => {
    render(<BuyDropdown />);

    expect(screen.getByText('Buy with')).toBeInTheDocument();
    expect(screen.getByText('10 ETH')).toBeInTheDocument();
    expect(screen.getByText('10 USDC')).toBeInTheDocument();
    expect(screen.getByText('1.23 DEGEN ≈ $10.00')).toBeInTheDocument();
  });

  it('triggers handleOnrampClick on payment method click', () => {
    (openPopup as Mock).mockReturnValue('popup');
    render(<BuyDropdown />);

    const onrampButton = screen.getByTestId('ock-coinbasePayOnrampItem');

    act(() => {
      fireEvent.click(onrampButton);
    });

    expect(mockStartPopupMonitor).toHaveBeenCalled();
  });

  it('does not render formatted amount if amountUSD is missing', () => {
    const contextWithNoUSD = {
      ...mockContextValue,
      to: { ...mockContextValue.to, amountUSD: '0' },
    };
    (useBuyContext as Mock).mockReturnValue(contextWithNoUSD);

    render(<BuyDropdown />);

    expect(screen.queryByText(/≈/)).not.toBeInTheDocument();
  });

  it('closes the dropdown when Escape key is pressed', () => {
    render(<BuyDropdown />);

    const { setIsDropdownOpen } = mockContextValue;

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });
    expect(setIsDropdownOpen).toHaveBeenCalledWith(false);
  });

  it('sends analytics when a payment method is selected', () => {
    (openPopup as Mock).mockReturnValue('popup');

    render(<BuyDropdown />);

    const onrampButton = screen.getByTestId('ock-coinbasePayOnrampItem');

    act(() => {
      fireEvent.click(onrampButton);
    });

    expect(sendOCKAnalyticsEvent).toHaveBeenCalledWith(
      BuyEvent.BuyOptionSelected,
      {
        option: 'CRYPTO_ACCOUNT',
      },
    );
  });

  it('triggers handleOnrampClick on payment method click', () => {
    (openPopup as Mock).mockReturnValue('popup');

    (getBuyFundingUrl as Mock).mockReturnValue(undefined);
    render(<BuyDropdown />);

    const onrampButton = screen.getByTestId('ock-coinbasePayOnrampItem');

    act(() => {
      fireEvent.click(onrampButton);
    });

    expect(mockStartPopupMonitor).not.toHaveBeenCalled();
  });
});
