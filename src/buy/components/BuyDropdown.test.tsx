import { openPopup } from '@/ui-react/internal/utils/openPopup';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useOnchainKit } from '../../core-react/useOnchainKit';
import { degenToken, ethToken, usdcToken } from '../../token/constants';
import { BuyDropdown } from './BuyDropdown';
import { useBuyContext } from './BuyProvider';

vi.mock('./BuyProvider', () => ({
  useBuyContext: vi.fn(),
}));

vi.mock('@/ui-react/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('../../core/utils/getRoundedAmount', () => ({
  getRoundedAmount: vi.fn(() => '10'),
}));

vi.mock('../../fund/utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(() => ({ height: 600, width: 400 })),
}));

vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    useAccount: () => ({ address: '0xMockAddress' }),
  };
});

vi.mock('../../core-react/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
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
    (useBuyContext as Mock).mockReturnValue(mockContextValue);
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

    const onrampButton = screen.getByTestId('ock-applePayOnrampItem');

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
    const buyButton = screen.getByTestId('ock-applePayOnrampItem');
    fireEvent.click(buyButton);

    expect(openPopup).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://pay.coinbase.com/buy/one-click?appId=mock-project-id&addresses={"0xMockAddress":["base"]}&assets=["DEGEN"]&presetCryptoAmount=0.5&defaultPaymentMethod=APPLE_PAY',
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
});
