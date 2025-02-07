import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { BuyEvent } from '@/core/analytics/types';
import { openPopup } from '@/internal/utils/openPopup';
import { degenToken, ethToken, usdcToken } from '@/token/constants';
import { useOnchainKit } from '@/useOnchainKit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { BuyDropdown } from './BuyDropdown';
import { useBuyContext } from './BuyProvider';

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

vi.mock('@/core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(),
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
    (useAnalytics as Mock).mockReturnValue({
      sendAnalytics: vi.fn(),
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

  it('adds a leading zero to fundAmount if it starts with a period', () => {
    (openPopup as Mock).mockImplementation(() => ({ closed: false })); // Mock popup function
    (useBuyContext as Mock).mockReturnValue({
      ...mockContextValue,
      to: { ...mockContextValue.to, amount: '.5' },
    });
    render(<BuyDropdown />);

    // Find and click the first BuyOnrampItem button
    const buyButton = screen.getByTestId('ock-coinbasePayOnrampItem');
    fireEvent.click(buyButton);

    expect(openPopup).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://pay.coinbase.com/buy/one-click?appId=mock-project-id&addresses={"0xMockAddress":["base"]}&assets=["DEGEN"]&presetCryptoAmount=0.5&defaultPaymentMethod=CRYPTO_ACCOUNT',
      }),
    );
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
    const mockSendAnalytics = vi.fn();
    (useAnalytics as Mock).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });
    (openPopup as Mock).mockReturnValue('popup');

    render(<BuyDropdown />);

    const onrampButton = screen.getByTestId('ock-coinbasePayOnrampItem');

    act(() => {
      fireEvent.click(onrampButton);
    });

    expect(mockSendAnalytics).toHaveBeenCalledWith(BuyEvent.BuyOptionSelected, {
      option: 'CRYPTO_ACCOUNT',
    });
  });
});
