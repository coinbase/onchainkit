import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDisconnect } from 'wagmi';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { WalletAdvancedWalletActions } from './WalletAdvancedWalletActions';
import { useWalletContext } from './WalletProvider';

vi.mock('wagmi', () => ({
  useDisconnect: vi.fn(),
}));

vi.mock('wagmi/actions', () => ({
  disconnect: vi.fn(),
}));

vi.mock('./WalletAdvancedProvider', () => ({
  useWalletAdvancedContext: vi.fn(),
  WalletAdvancedProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('WalletAdvancedWalletActions', () => {
  const mockUseWalletContext = useWalletContext as ReturnType<typeof vi.fn>;
  const mockUseWalletAdvancedContext = useWalletAdvancedContext as ReturnType<
    typeof vi.fn
  >;

  const defaultMockUseWalletAdvancedContext = {
    animations: {
      content: '',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseWalletAdvancedContext.mockReturnValue(
      defaultMockUseWalletAdvancedContext,
    );
  });

  it('renders the WalletAdvancedWalletActions component', () => {
    const handleCloseMock = vi.fn();
    mockUseWalletContext.mockReturnValue({ handleClose: handleCloseMock });

    const setShowQrMock = vi.fn();
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      setShowQr: setShowQrMock,
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

    const setShowQrMock = vi.fn();
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      setShowQr: setShowQrMock,
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
    const setShowQrMock = vi.fn();
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      setShowQr: setShowQrMock,
    });

    render(<WalletAdvancedWalletActions />);

    const qrButton = screen.getByTestId('ockWalletAdvanced_QrButton');
    fireEvent.click(qrButton);

    expect(setShowQrMock).toHaveBeenCalled();
  });

  it('refreshes portfolio data when refresh button is clicked', () => {
    const refetchPortfolioDataMock = vi.fn();
    mockUseWalletAdvancedContext.mockReturnValue({
      ...defaultMockUseWalletAdvancedContext,
      refetchPortfolioData: refetchPortfolioDataMock,
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
    });

    mockUseWalletAdvancedContext.mockReturnValue({
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
});
