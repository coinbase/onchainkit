import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { WalletEvent, WalletOption } from '@/core/analytics/types';
import { useOnchainKit } from '@/useOnchainKit';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { WalletAdvancedTransactionActions } from './WalletAdvancedTransactionActions';
import { useWalletContext } from './WalletProvider';
import { usePortfolio } from '../hooks/usePortfolio';

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('../hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('@/core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    sendAnalytics: vi.fn(),
  })),
}));

describe('WalletAdvancedTransactionActons', () => {
  const mockUseOnchainKit = useOnchainKit as ReturnType<typeof vi.fn>;

  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;

  const defaultMockUseWalletAdvancedContext = {
    setActiveFeature: vi.fn(),
    animations: {
      content: '',
    },
  };

  const mockProjectId = '123-ABC';
  const mockAddress = '0x123';
  const mockChain = { name: 'Base' };

  const mockSendAnalytics = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'open').mockImplementation(() => null);
    mockUseOnchainKit.mockReturnValue({
      projectId: mockProjectId,
    });

    mockUseWalletContext.mockReturnValue({
      address: mockAddress,
      chain: mockChain,
      ...defaultMockUseWalletAdvancedContext,
    });

    (useAnalytics as ReturnType<typeof vi.fn>).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });

    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [],
      },
      isFetching: false,
    });
  });

  it('renders the WalletAdvancedTransactionActions component', () => {
    render(<WalletAdvancedTransactionActions />);

    const buyButton = screen.getByRole('button', { name: 'Buy' });
    const sendButton = screen.getByRole('button', { name: 'Send' });
    const swapButton = screen.getByRole('button', { name: 'Swap' });

    expect(buyButton).toBeDefined();
    expect(sendButton).toBeDefined();
    expect(swapButton).toBeDefined();
  });

  it('opens the buy page when the buy button is clicked and projectId, address and chain.name are defined', () => {
    render(<WalletAdvancedTransactionActions />);

    const buyButton = screen.getByRole('button', { name: 'Buy' });
    fireEvent.click(buyButton);

    const urlString = vi.mocked(window.open).mock.calls[0][0] as string;
    const url = new URL(urlString);
    const params = Object.fromEntries(url.searchParams);

    expect(url.origin + url.pathname).toBe(
      'https://pay.coinbase.com/buy/select-asset',
    );
    expect(params).toEqual({
      appId: mockProjectId,
      destinationWallets: JSON.stringify([
        {
          address: mockAddress,
          blockchains: [mockChain.name.toLowerCase()],
        },
      ]),
      defaultAsset: 'USDC',
      defaultPaymentMethod: 'CRYPTO_ACCOUNT',
      presetFiatAmount: '25',
    });
    expect(vi.mocked(window.open).mock.calls[0][1]).toBe('popup');
    expect(vi.mocked(window.open).mock.calls[0][2]).toBe(
      'width=400,height=600,scrollbars=yes',
    );
  });

  it('does not open the buy page when the buy button is clicked and projectId, address or chain.name are not defined', () => {
    mockUseOnchainKit.mockReturnValue({
      projectId: null,
    });
    mockUseWalletContext.mockReturnValue({
      address: '0x123',
      chain: mockChain,
      ...defaultMockUseWalletAdvancedContext,
    });

    const { rerender } = render(<WalletAdvancedTransactionActions />);
    const buyButton = screen.getByRole('button', { name: 'Buy' });
    fireEvent.click(buyButton);
    expect(window.open).not.toHaveBeenCalled();

    mockUseOnchainKit.mockReturnValue({
      projectId: mockProjectId,
    });
    mockUseWalletContext.mockReturnValue({
      address: null,
      chain: mockChain,
      ...defaultMockUseWalletAdvancedContext,
    });
    rerender(<WalletAdvancedTransactionActions />);
    fireEvent.click(buyButton);
    expect(window.open).not.toHaveBeenCalled();

    mockUseWalletContext.mockReturnValue({
      address: mockAddress,
      chain: null,
      ...defaultMockUseWalletAdvancedContext,
    });
    rerender(<WalletAdvancedTransactionActions />);
    fireEvent.click(buyButton);
    expect(window.open).not.toHaveBeenCalled();
  });

  it('sets activeFeature to send when the send button is clicked', () => {
    render(<WalletAdvancedTransactionActions />);

    const sendButton = screen.getByRole('button', { name: 'Send' });
    fireEvent.click(sendButton);

    expect(
      defaultMockUseWalletAdvancedContext.setActiveFeature,
    ).toHaveBeenCalledWith('send');
  });

  it('sets activeFeature to swap when the swap button is clicked', () => {
    render(<WalletAdvancedTransactionActions />);

    const swapButton = screen.getByRole('button', { name: 'Swap' });
    fireEvent.click(swapButton);

    expect(
      defaultMockUseWalletAdvancedContext.setActiveFeature,
    ).toHaveBeenCalledWith('swap');
  });

  it('renders a placeholder when fetcher is loading', () => {
    mockUseWalletContext.mockReturnValue({
      address: mockAddress,
      chain: mockChain,
      ...defaultMockUseWalletAdvancedContext,
    });

    (usePortfolio as Mock).mockReturnValue({
      data: {
        tokenBalances: [],
      },
      isFetching: true,
    });

    render(<WalletAdvancedTransactionActions />);

    const placeholder = screen.getByTestId('ockSkeleton');
    expect(placeholder).toHaveClass('my-3 h-16 w-80');
  });

  it('applies custom classNames when provided', () => {
    const customClassNames = {
      container: 'custom-container',
      leftAction: {
        container: 'custom-left-button',
        icon: 'custom-left-icon',
        label: 'custom-left-label',
      },
      middleAction: {
        container: 'custom-middle-button',
        icon: 'custom-middle-icon',
        label: 'custom-middle-label',
      },
      rightAction: {
        container: 'custom-right-button',
        icon: 'custom-right-icon',
        label: 'custom-right-label',
      },
    };

    render(<WalletAdvancedTransactionActions classNames={customClassNames} />);

    const container = screen.getByTestId(
      'ockWalletAdvanced_TransactionActions',
    );
    expect(container.className).toContain('custom-container');

    const buyButton = screen.getByRole('button', { name: 'Buy' });
    expect(buyButton.className).toContain('custom-left-button');
    expect(buyButton.querySelector('span:first-child')?.className).toContain(
      'custom-left-icon',
    );
    expect(buyButton.querySelector('span:last-child')?.className).toContain(
      'custom-left-label',
    );

    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton.className).toContain('custom-middle-button');
    expect(sendButton.querySelector('span:first-child')?.className).toContain(
      'custom-middle-icon',
    );
    expect(sendButton.querySelector('span:last-child')?.className).toContain(
      'custom-middle-label',
    );

    const swapButton = screen.getByRole('button', { name: 'Swap' });
    expect(swapButton.className).toContain('custom-right-button');
    expect(swapButton.querySelector('span:first-child')?.className).toContain(
      'custom-right-icon',
    );
    expect(swapButton.querySelector('span:last-child')?.className).toContain(
      'custom-right-label',
    );
  });

  describe('analytics', () => {
    it('sends analytics when buy button is clicked', () => {
      render(<WalletAdvancedTransactionActions />);

      const buyButton = screen.getByRole('button', { name: 'Buy' });
      fireEvent.click(buyButton);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.OptionSelected,
        {
          option: WalletOption.Buy,
        },
      );
    });

    it('sends analytics when send button is clicked', () => {
      render(<WalletAdvancedTransactionActions />);

      const sendButton = screen.getByRole('button', { name: 'Send' });
      fireEvent.click(sendButton);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.OptionSelected,
        {
          option: WalletOption.Send,
        },
      );
    });

    it('sends analytics when swap button is clicked', () => {
      render(<WalletAdvancedTransactionActions />);

      const swapButton = screen.getByRole('button', { name: 'Swap' });
      fireEvent.click(swapButton);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.OptionSelected,
        {
          option: WalletOption.Swap,
        },
      );
    });

    it('sends analytics for buy action only when required parameters are present', () => {
      mockUseOnchainKit.mockReturnValue({
        projectId: null,
      });

      const { rerender } = render(<WalletAdvancedTransactionActions />);
      const buyButton = screen.getByRole('button', { name: 'Buy' });

      fireEvent.click(buyButton);
      expect(mockSendAnalytics).toHaveBeenCalledTimes(1);
      expect(window.open).not.toHaveBeenCalled();

      mockUseOnchainKit.mockReturnValue({
        projectId: mockProjectId,
      });
      mockUseWalletContext.mockReturnValue({
        address: mockAddress,
        chain: mockChain,
        ...defaultMockUseWalletAdvancedContext,
      });

      rerender(<WalletAdvancedTransactionActions />);
      fireEvent.click(buyButton);

      expect(mockSendAnalytics).toHaveBeenCalledTimes(2);
      expect(window.open).toHaveBeenCalled();
    });

    it('does not send duplicate analytics events on multiple clicks', () => {
      render(<WalletAdvancedTransactionActions />);

      const buyButton = screen.getByRole('button', { name: 'Buy' });
      fireEvent.click(buyButton);
      fireEvent.click(buyButton);

      const sendButton = screen.getByRole('button', { name: 'Send' });
      fireEvent.click(sendButton);
      fireEvent.click(sendButton);

      const swapButton = screen.getByRole('button', { name: 'Swap' });
      fireEvent.click(swapButton);
      fireEvent.click(swapButton);

      expect(mockSendAnalytics).toHaveBeenCalledTimes(6);
      expect(mockSendAnalytics).toHaveBeenNthCalledWith(
        1,
        WalletEvent.OptionSelected,
        { option: WalletOption.Buy },
      );
      expect(mockSendAnalytics).toHaveBeenNthCalledWith(
        2,
        WalletEvent.OptionSelected,
        { option: WalletOption.Buy },
      );
      expect(mockSendAnalytics).toHaveBeenNthCalledWith(
        3,
        WalletEvent.OptionSelected,
        { option: WalletOption.Send },
      );
      expect(mockSendAnalytics).toHaveBeenNthCalledWith(
        4,
        WalletEvent.OptionSelected,
        { option: WalletOption.Send },
      );
      expect(mockSendAnalytics).toHaveBeenNthCalledWith(
        5,
        WalletEvent.OptionSelected,
        { option: WalletOption.Swap },
      );
      expect(mockSendAnalytics).toHaveBeenNthCalledWith(
        6,
        WalletEvent.OptionSelected,
        { option: WalletOption.Swap },
      );
    });
  });
});
