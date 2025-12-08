import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { WalletEvent, WalletOption } from '@/core/analytics/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDisconnect } from 'wagmi';
import { WalletAdvancedWalletActions } from './WalletAdvancedWalletActions';
import { useWalletContext } from './WalletProvider';
import { usePortfolio } from '../hooks/usePortfolio';

vi.mock('wagmi', () => ({
  useDisconnect: vi.fn(),
  useAccount: vi.fn().mockReturnValue({
    address: '0x123',
  }),
}));

vi.mock('../hooks/usePortfolio', () => ({
  usePortfolio: vi.fn(),
}));

vi.mock('wagmi/actions', () => ({
  disconnect: vi.fn(),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('@/core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(() => ({
    sendAnalytics: vi.fn(),
  })),
}));

describe('WalletAdvancedWalletActions', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockSendAnalytics = vi.fn();
  const refetchPortfolioDataMock = vi.fn();

  const defaultMockUseWalletAdvancedContext = {
    setActiveFeature: vi.fn(),
    animations: {
      content: '',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletContext.mockReturnValue(defaultMockUseWalletAdvancedContext);

    (useAnalytics as Mock).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });

    (usePortfolio as Mock).mockReturnValue({
      refetch: refetchPortfolioDataMock,
    });
  });

  it('renders the WalletAdvancedWalletActions component', () => {
    const handleCloseMock = vi.fn();
    mockUseWalletContext.mockReturnValue({
      handleClose: handleCloseMock,
      ...defaultMockUseWalletAdvancedContext,
    });

    (useDisconnect as Mock).mockReturnValue({
      disconnect: vi.fn(),
      connectors: [],
    });

    render(<WalletAdvancedWalletActions />);

    expect(
      screen.getByTestId('ockWalletAdvanced_TransactionsButton'),
    ).toBeDefined();
    expect(screen.getByTestId('ockWalletAdvanced_QrButton')).toBeDefined();
    expect(
      screen.getByTestId('ockWalletAdvanced_DisconnectButton'),
    ).toBeDefined();
    expect(screen.getByTestId('ockWalletAdvanced_RefreshButton')).toBeDefined();
  });

  it('disconnects connectors and closes when disconnect button is clicked', () => {
    const handleCloseMock = vi.fn();
    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      handleClose: handleCloseMock,
    });

    const disconnectMock = vi.fn();
    (useDisconnect as Mock).mockReturnValue({
      disconnect: disconnectMock,
      connectors: [{ id: 'mock-connector' }],
    });

    render(<WalletAdvancedWalletActions />);

    const disconnectButton = screen.getByTestId(
      'ockWalletAdvanced_DisconnectButton',
    );
    fireEvent.click(disconnectButton);

    expect(disconnectMock).toHaveBeenCalled();
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it('sets showQr to true when qr button is clicked', () => {
    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
    });

    render(<WalletAdvancedWalletActions />);

    const qrButton = screen.getByTestId('ockWalletAdvanced_QrButton');
    fireEvent.click(qrButton);

    expect(
      defaultMockUseWalletAdvancedContext.setActiveFeature,
    ).toHaveBeenCalledWith('qr');
  });

  it('refreshes portfolio data when refresh button is clicked', () => {
    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
    });

    render(<WalletAdvancedWalletActions />);

    const refreshButton = screen.getByTestId('ockWalletAdvanced_RefreshButton');
    fireEvent.click(refreshButton);

    expect(refetchPortfolioDataMock).toHaveBeenCalled();
  });

  it('opens transaction history when transactions button is clicked', () => {
    mockUseWalletContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      address: '0x123',
    });

    const windowOpenSpy = vi
      .spyOn(window, 'open')
      .mockImplementation(() => null);

    render(<WalletAdvancedWalletActions />);

    const transactionsButton = screen.getByTestId(
      'ockWalletAdvanced_TransactionsButton',
    );
    fireEvent.click(transactionsButton);

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://basescan.org/address/0x123',
      '_blank',
    );

    windowOpenSpy.mockRestore();
  });

  it('applies custom classNames when provided', () => {
    const customClassNames = {
      container: 'custom-container',
      baseScanIcon: 'custom-icon-one',
      qrIcon: 'custom-icon-two',
      disconnectIcon: 'custom-icon-three',
      refreshIcon: 'custom-icon-four',
    };

    mockUseWalletContext.mockReturnValue({
      address: '0x123',
      handleClose: vi.fn(),
      ...defaultMockUseWalletAdvancedContext,
      setShowQr: vi.fn(),
      refetchPortfolioData: vi.fn(),
    });

    (useDisconnect as Mock).mockReturnValue({
      disconnect: vi.fn(),
      connectors: [],
    });

    render(<WalletAdvancedWalletActions classNames={customClassNames} />);

    // Check container
    const container = screen.getByTestId('ockWalletAdvanced_WalletActions');
    expect(container.className).toContain('custom-container');

    // Check individual icons
    const transactionsButton = screen.getByTestId(
      'ockWalletAdvanced_TransactionsButton',
    );
    expect(transactionsButton.className).toContain('custom-icon-one');

    const qrButton = screen.getByTestId('ockWalletAdvanced_QrButton');
    expect(qrButton.className).toContain('custom-icon-two');

    const disconnectButton = screen.getByTestId(
      'ockWalletAdvanced_DisconnectButton',
    );
    expect(disconnectButton.className).toContain('custom-icon-three');

    const refreshButton = screen.getByTestId('ockWalletAdvanced_RefreshButton');
    expect(refreshButton.className).toContain('custom-icon-four');
  });

  describe('analytics', () => {
    it('sends analytics when transactions button is clicked', () => {
      const address = '0x123';
      mockUseWalletContext.mockReturnValue({
        ...defaultMockUseWalletAdvancedContext,
        address,
        handleClose: vi.fn(),
      });

      const windowOpenSpy = vi
        .spyOn(window, 'open')
        .mockImplementation(() => null);

      render(<WalletAdvancedWalletActions />);

      const transactionsButton = screen.getByTestId(
        'ockWalletAdvanced_TransactionsButton',
      );
      fireEvent.click(transactionsButton);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.OptionSelected,
        {
          option: WalletOption.Explorer,
        },
      );

      windowOpenSpy.mockRestore();
    });

    it('sends analytics when QR button is clicked', () => {
      mockUseWalletContext.mockReturnValue({
        ...defaultMockUseWalletAdvancedContext,
      });

      render(<WalletAdvancedWalletActions />);

      const qrButton = screen.getByTestId('ockWalletAdvanced_QrButton');
      fireEvent.click(qrButton);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.OptionSelected,
        {
          option: WalletOption.QR,
        },
      );
    });

    it('sends analytics when refresh button is clicked', () => {
      mockUseWalletContext.mockReturnValue({
        ...defaultMockUseWalletAdvancedContext,
      });

      render(<WalletAdvancedWalletActions />);

      const refreshButton = screen.getByTestId(
        'ockWalletAdvanced_RefreshButton',
      );
      fireEvent.click(refreshButton);

      expect(mockSendAnalytics).toHaveBeenCalledWith(
        WalletEvent.OptionSelected,
        {
          option: WalletOption.Refresh,
        },
      );
    });

    it('sends analytics when disconnect button is clicked', () => {
      const handleCloseMock = vi.fn();
      const mockWalletProvider = 'TestWallet';

      mockUseWalletContext.mockReturnValue({
        ...defaultMockUseWalletAdvancedContext,
        handleClose: handleCloseMock,
      });

      (useDisconnect as Mock).mockReturnValue({
        disconnect: vi.fn(),
        connectors: [{ name: mockWalletProvider }],
      });

      render(<WalletAdvancedWalletActions />);

      const disconnectButton = screen.getByTestId(
        'ockWalletAdvanced_DisconnectButton',
      );
      fireEvent.click(disconnectButton);

      expect(mockSendAnalytics).toHaveBeenCalledWith(WalletEvent.Disconnect, {
        component: 'WalletAdvanced',
        walletProvider: mockWalletProvider,
      });
    });

    it('sends analytics with unknown wallet provider when disconnecting without connector name', () => {
      const handleCloseMock = vi.fn();

      mockUseWalletContext.mockReturnValue({
        ...defaultMockUseWalletAdvancedContext,
        handleClose: handleCloseMock,
      });

      (useDisconnect as Mock).mockReturnValue({
        disconnect: vi.fn(),
        connectors: [{ name: undefined }],
      });

      render(<WalletAdvancedWalletActions />);

      const disconnectButton = screen.getByTestId(
        'ockWalletAdvanced_DisconnectButton',
      );
      fireEvent.click(disconnectButton);

      expect(mockSendAnalytics).toHaveBeenCalledWith(WalletEvent.Disconnect, {
        component: 'WalletAdvanced',
        walletProvider: 'unknown',
      });
    });
  });
});
