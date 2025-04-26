import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Connected } from './Connected';
import { useAccount } from 'wagmi';

// Mock the wagmi hook
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

// Mock the ConnectWallet component
vi.mock('@/wallet', () => ({
  ConnectWallet: () => <div data-testid="connect-wallet">Connect Wallet</div>,
}));

describe('Connected', () => {
  describe('when user is connected', () => {
    beforeEach(() => {
      (useAccount as ReturnType<typeof vi.fn>).mockReturnValue({
        isConnected: true,
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
  });
});
