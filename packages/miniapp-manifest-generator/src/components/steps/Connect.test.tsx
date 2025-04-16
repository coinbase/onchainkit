import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Connect } from './Connect';
import { type ReactNode, act } from 'react';

vi.mock('@coinbase/onchainkit/wallet', () => ({
  Wallet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-wallet">{children}</div>
  ),
  ConnectWallet: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <button data-testid="mock-connect-wallet" className={className}>
      {children}
    </button>
  ),
  WalletDropdown: ({ children }: { children: ReactNode }) => (
    <div data-testid="mock-wallet-dropdown">{children}</div>
  ),
  WalletDropdownDisconnect: () => (
    <button data-testid="mock-disconnect">Disconnect</button>
  ),
}));

vi.mock('@coinbase/onchainkit/identity', () => ({
  Avatar: () => <div data-testid="mock-avatar">Avatar</div>,
  Name: () => <div data-testid="mock-name">Name</div>,
  Address: () => <div data-testid="mock-address">Address</div>,
  EthBalance: () => <div data-testid="mock-eth-balance">0 ETH</div>,
  Identity: ({
    children,
    hasCopyAddressOnClick,
  }: {
    children: ReactNode;
    hasCopyAddressOnClick?: boolean;
  }) => (
    <div
      data-testid="mock-identity"
      onClick={hasCopyAddressOnClick ? () => {} : undefined}
    >
      {children}
    </div>
  ),
}));

describe('Connect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render', () => {
    render(<Connect />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Connect your wallet')).toBeInTheDocument();
    expect(
      screen.getByText(/Set up a wallet using your Warpcast recovery key/),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-wallet')).toBeInTheDocument();
    expect(screen.getByTestId('mock-connect-wallet')).toBeInTheDocument();
  });

  it('should handle modal mutation observer', async () => {
    const { container } = render(<Connect />);

    const modal = document.createElement('div');
    modal.setAttribute('data-testid', 'ockModalOverlay');
    modal.innerHTML = `
      <div>
        <div class="flex w-full flex-col gap-3">
          <button>Sign Up</button>
          <div class="relative">Or Continue</div>
        </div>
      </div>
    `;

    container.appendChild(modal);

    const signUpButton = modal.querySelector('button') as HTMLElement;
    const orContinueDiv = modal.querySelector('.relative') as HTMLElement;

    await act(async () => {
      // let mutation observer run
      vi.advanceTimersByTime(1);
    });

    expect(signUpButton?.style.display).toBe('none');
    expect(orContinueDiv?.style.display).toBe('none');
  });
});
