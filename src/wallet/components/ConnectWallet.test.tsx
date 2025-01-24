// @ts-nocheck -- will fix later as it'll require a lot of changes
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount, useConnect } from 'wagmi';
import { useOnchainKit } from '../../useOnchainKit';
import { ConnectWallet } from './ConnectWallet';
import { ConnectWalletText } from './ConnectWalletText';
import { useWalletContext } from './WalletProvider';

const openConnectModalMock = vi.fn();

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
  useConnectors: vi.fn(() => ({ connectors: [{ id: 'mockConnector' }] })),
}));

vi.mock('../../identity/components/IdentityProvider', () => ({
  IdentityProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('./WalletProvider', () => ({
  useWalletContext: vi.fn(),
  WalletProvider: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({
      children,
    }: {
      children: (props: { openConnectModal: () => void }) => ReactNode;
    }) => children({ openConnectModal: openConnectModalMock }),
  },
}));

vi.mock('@/useOnchainKit', () => ({
  useOnchainKit: vi.fn(),
}));

describe('ConnectWallet', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    vi.mocked(useAccount).mockReturnValue({
      address: '',
      status: 'disconnected',
    });
    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'idle',
    });
    vi.mocked(useWalletContext).mockReturnValue({
      isSubComponentOpen: false,
      handleClose: vi.fn(),
      setIsSubComponentOpen: vi.fn(),
    });
    vi.mocked(useOnchainKit).mockReturnValue({
      config: { wallet: { display: undefined } },
    });
  });

  it('should render connect button when disconnected', () => {
    render(<ConnectWallet text="Connect Wallet" />);
    const button = screen.getByTestId('ockConnectButton');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Connect Wallet');
  });

  it('should render spinner when loading', () => {
    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: vi.fn(),
      status: 'pending',
    });
    vi.mocked(useAccount).mockReturnValue({
      address: '',
      status: 'connecting',
    });
    render(<ConnectWallet text="Connect Wallet" />);
    const spinner = screen.getByTestId('ockSpinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should render children when connected', () => {
    vi.mocked(useAccount).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });
    render(
      <ConnectWallet text="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );
    const connectedText = screen.getByText('Wallet Connected');
    expect(connectedText).toBeInTheDocument();
  });

  it('should call connect function when connect button is clicked', () => {
    const connectMock = vi.fn();
    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: connectMock,
      status: 'idle',
    });
    render(<ConnectWallet text="Connect Wallet" />);
    const button = screen.getByTestId('ockConnectButton');
    fireEvent.click(button);
    expect(connectMock).toHaveBeenCalledWith(
      {
        connector: { id: 'mockConnector' },
      },
      {
        onSuccess: expect.any(Function),
      },
    );
  });

  it('should toggle wallet modal on button click when connected', () => {
    const setIsSubComponentOpenMock = vi.fn();
    const handleCloseMock = vi.fn();
    vi.mocked(useAccount).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });
    vi.mocked(useWalletContext).mockReturnValue({
      isSubComponentOpen: false,
      setIsSubComponentOpen: setIsSubComponentOpenMock,
      handleClose: handleCloseMock,
    });

    const { rerender } = render(
      <ConnectWallet text="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );
    const button = screen.getByText('Wallet Connected');
    fireEvent.click(button);
    expect(setIsSubComponentOpenMock).toHaveBeenCalledWith(true);

    vi.mocked(useWalletContext).mockReturnValue({
      isSubComponentOpen: true,
      setIsSubComponentOpen: setIsSubComponentOpenMock,
      handleClose: handleCloseMock,
    });

    rerender(
      <ConnectWallet text="Connect Wallet">
        <div>Wallet Connected</div>
      </ConnectWallet>,
    );

    fireEvent.click(button);
    expect(handleCloseMock).toHaveBeenCalled();
  });

  it('applies ock-bg-secondary-active class when isOpen is true', () => {
    vi.mocked(useWalletContext).mockReturnValue({
      isSubComponentOpen: true,
      handleClose: vi.fn(),
    });
    vi.mocked(useAccount).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });
    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'test-connector' }],
      connect: vi.fn(),
      status: 'idle',
    });
    render(
      <ConnectWallet>
        <span>Test Children</span>
      </ConnectWallet>,
    );
    const button = screen.getByTestId('ockConnectWallet_Connected');
    expect(button).toHaveClass('ock-bg-secondary-active');
  });

  it('should not render ConnectWalletText when children are present', () => {
    vi.mocked(useAccount).mockReturnValue({
      address: '0x123',
      status: 'connected',
    });
    render(
      <ConnectWallet>
        <ConnectWalletText>Not Render</ConnectWalletText>
        <div>Wallet Ciao</div>
      </ConnectWallet>,
    );
    const connectedText = screen.getByText('Wallet Ciao');
    expect(connectedText).toBeInTheDocument();
    expect(screen.queryByText('Not Render')).not.toBeInTheDocument();
  });

  it('should call onConnect callback when connect button is clicked', async () => {
    const mockUseAccount = vi.mocked(useAccount);
    const connectMock = vi.fn();
    const onConnectMock = vi.fn();

    mockUseAccount.mockReturnValue({
      address: undefined,
      status: 'disconnected',
    });

    vi.mocked(useConnect).mockReturnValue({
      connectors: [{ id: 'mockConnector' }],
      connect: connectMock,
      status: 'idle',
    });

    render(<ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />);

    const button = screen.getByTestId('ockConnectButton');
    fireEvent.click(button);

    connectMock.mock.calls[0][1].onSuccess();

    mockUseAccount.mockReturnValue({
      address: '0x123',
      status: 'connected',
    });

    render(<ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />);

    expect(onConnectMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onConnect callback when component is first mounted', () => {
    const mockUseAccount = vi.mocked(useAccount);
    mockUseAccount.mockReturnValue({
      address: '0x123',
      status: 'connected',
    });

    const onConnectMock = vi.fn();
    render(<ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />);

    expect(onConnectMock).toHaveBeenCalledTimes(0);
  });

  describe('wallet display modes', () => {
    it('should render modal when config.wallet.display is "modal"', () => {
      vi.mocked(useOnchainKit).mockReturnValue({
        config: { wallet: { display: 'modal' } },
      });
      vi.mocked(useAccount).mockReturnValue({
        address: '',
        status: 'disconnected',
      });
      vi.mocked(useConnect).mockReturnValue({
        connectors: [{ id: 'mockConnector' }],
        connect: vi.fn(),
        status: 'idle',
      });
      const setIsConnectModalOpenMock = vi.fn();
      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
        setIsConnectModalOpen: setIsConnectModalOpenMock,
      });

      render(<ConnectWallet text="Connect Wallet" />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      expect(setIsConnectModalOpenMock).toHaveBeenCalledWith(true);
      expect(screen.getByTestId('ockModalOverlay')).toBeInTheDocument();
    });

    it('should render direct connect when config.wallet.display is undefined', () => {
      const connectMock = vi.fn();
      vi.mocked(useConnect).mockReturnValue({
        connectors: [{ id: 'mockConnector' }],
        connect: connectMock,
        status: 'idle',
      });

      render(<ConnectWallet text="Connect Wallet" />);

      const connectButton = screen.getByTestId('ockConnectButton');
      fireEvent.click(connectButton);

      expect(connectMock).toHaveBeenCalledWith(
        { connector: { id: 'mockConnector' } },
        { onSuccess: expect.any(Function) },
      );
    });
  });

  describe('connectWalletText handling', () => {
    it('should use custom text from ConnectWalletText component when provided', () => {
      vi.mocked(useAccount).mockReturnValue({
        address: '',
        status: 'disconnected',
      });

      render(
        <ConnectWallet>
          <ConnectWalletText>Custom Connect Text</ConnectWalletText>
        </ConnectWallet>,
      );

      const button = screen.getByTestId('ockConnectButton');
      expect(button).toHaveTextContent('Custom Connect Text');
    });

    it('should handle direct connect with onConnect callback', () => {
      const onConnectMock = vi.fn();
      const connectMock = vi.fn();

      vi.mocked(useConnect).mockReturnValue({
        connectors: [{ id: 'mockConnector' }],
        connect: connectMock,
        status: 'idle',
      });

      vi.mocked(useAccount).mockReturnValue({
        address: '',
        status: 'disconnected',
      });

      render(<ConnectWallet text="Connect" onConnect={onConnectMock} />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      expect(connectMock).toHaveBeenCalledWith(
        { connector: { id: 'mockConnector' } },
        { onSuccess: expect.any(Function) },
      );

      connectMock.mock.calls[0][1].onSuccess();

      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('modal handling', () => {
    it('should close modal when clicking close button', () => {
      vi.mocked(useOnchainKit).mockReturnValue({
        config: { wallet: { display: 'modal' } },
      });
      vi.mocked(useAccount).mockReturnValue({
        address: '',
        status: 'disconnected',
      });
      const setIsConnectModalOpenMock = vi.fn();
      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
        setIsConnectModalOpen: setIsConnectModalOpenMock,
      });

      render(<ConnectWallet text="Connect Wallet" />);

      const connectButton = screen.getByTestId('ockConnectButton');
      fireEvent.click(connectButton);

      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      expect(setIsConnectModalOpenMock).toHaveBeenCalledWith(false);
    });
  });

  describe('connection state handling', () => {
    it('should handle connection state changes and onConnect callback', async () => {
      const onConnectMock = vi.fn();
      const mockUseAccount = vi.mocked(useAccount);
      const connectMock = vi.fn();

      mockUseAccount.mockReturnValue({
        address: undefined,
        status: 'disconnected',
      });

      vi.mocked(useConnect).mockReturnValue({
        connectors: [{ id: 'mockConnector' }],
        connect: connectMock,
        status: 'idle',
      });

      const { rerender } = render(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      const onSuccessCallback = connectMock.mock.calls[0][1].onSuccess;
      onSuccessCallback();

      mockUseAccount.mockReturnValue({
        address: '0x123',
        status: 'connected',
      });

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      expect(onConnectMock).toHaveBeenCalledTimes(1);

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );
      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });

    it('should handle direct connection with onConnect callback', () => {
      const onConnectMock = vi.fn();
      const connectMock = vi.fn();

      vi.mocked(useConnect).mockReturnValue({
        connectors: [{ id: 'mockConnector' }],
        connect: connectMock,
        status: 'idle',
      });

      vi.mocked(useAccount).mockReturnValue({
        address: '',
        status: 'disconnected',
      });

      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
      });

      render(<ConnectWallet text="Connect" onConnect={onConnectMock} />);

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      connectMock.mock.calls[0][1].onSuccess();

      vi.mocked(useAccount).mockReturnValue({
        address: '0x123',
        status: 'connected',
      });

      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });

    it('should handle hasClickedConnect state with onConnect callback', () => {
      const onConnectMock = vi.fn();
      const connectMock = vi.fn();

      vi.mocked(useConnect).mockReturnValue({
        connectors: [{ id: 'mockConnector' }],
        connect: connectMock,
        status: 'idle',
      });

      vi.mocked(useAccount).mockReturnValue({
        address: '',
        status: 'disconnected',
      });

      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
      });

      const { rerender } = render(
        <ConnectWallet text="Connect" onConnect={onConnectMock} />,
      );

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);

      connectMock.mock.calls[0][1].onSuccess();

      vi.mocked(useAccount).mockReturnValue({
        address: '0x123',
        status: 'connected',
      });

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });

    it('should handle hasClickedConnect state correctly when modal is used', () => {
      const onConnectMock = vi.fn();
      const mockUseAccount = vi.mocked(useAccount);
      const setIsConnectModalOpenMock = vi.fn();

      vi.mocked(useOnchainKit).mockReturnValue({
        config: { wallet: { display: 'modal' } },
      });

      vi.mocked(useWalletContext).mockReturnValue({
        isConnectModalOpen: true,
        setIsConnectModalOpen: setIsConnectModalOpenMock,
      });

      mockUseAccount.mockReturnValue({
        address: undefined,
        status: 'disconnected',
      });

      const { rerender } = render(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      const button = screen.getByTestId('ockConnectButton');
      fireEvent.click(button);
      expect(setIsConnectModalOpenMock).toHaveBeenCalledWith(true);

      mockUseAccount.mockReturnValue({
        address: '0x123',
        status: 'connected',
      });

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );

      expect(onConnectMock).toHaveBeenCalledTimes(1);

      rerender(
        <ConnectWallet text="Connect Wallet" onConnect={onConnectMock} />,
      );
      expect(onConnectMock).toHaveBeenCalledTimes(1);
    });
  });
});
