import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Connected } from '../';
import { useAccount } from 'wagmi';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('@/wallet', () => ({
  ConnectWallet: () => <div data-testid="connect-wallet">Connect Wallet</div>,
}));

describe('Connected', () => {
  describe('when user is connected', () => {
    beforeEach(() => {
      (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
        isConnected: true,
        isConnecting: false,
        address: '0x123',
      });
    });

    it('renders children when user is connected', () => {
      render(
        <Connected>
          <div data-testid="connected-content">Connected Content</div>
        </Connected>,
      );

      expect(screen.getByTestId('connected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('connect-wallet')).not.toBeInTheDocument();
    });
  });

  describe('when user is not connected', () => {
    beforeEach(() => {
      (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
        isConnected: false,
        isConnecting: false,
        address: undefined,
      });
    });

    it('renders the fallback element when user is not connected', () => {
      render(
        <Connected>
          <div data-testid="connected-content">Connected Content</div>
        </Connected>,
      );

      expect(screen.queryByTestId('connected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
    });

    it('renders custom fallback when provided', () => {
      render(
        <Connected
          fallback={<div data-testid="custom-fallback">Custom Fallback</div>}
        >
          <div data-testid="connected-content">Connected Content</div>
        </Connected>,
      );

      expect(screen.queryByTestId('connected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.queryByTestId('connect-wallet')).not.toBeInTheDocument();
    });

    it('renders nothing when fallback is null', () => {
      render(
        <Connected fallback={null}>
          <div data-testid="connected-content">Connected Content</div>
        </Connected>,
      );

      expect(screen.queryByTestId('connected-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('connect-wallet')).not.toBeInTheDocument();
    });
  });

  describe('when user is connecting', () => {
    beforeEach(() => {
      (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
        isConnected: false,
        isConnecting: true,
        address: undefined,
      });
    });

    it('renders default fallback when connecting prop is not provided', () => {
      render(
        <Connected>
          <div data-testid="connected-content">Connected Content</div>
        </Connected>,
      );

      expect(screen.queryByTestId('connected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('connect-wallet')).toBeInTheDocument();
    });

    it('renders connecting element when connecting prop is provided', () => {
      render(
        <Connected
          connecting={<div data-testid="connecting-state">Connecting...</div>}
        >
          <div data-testid="connected-content">Connected Content</div>
        </Connected>,
      );

      expect(screen.queryByTestId('connected-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('connect-wallet')).not.toBeInTheDocument();
      expect(screen.getByTestId('connecting-state')).toBeInTheDocument();
    });
  });
});
