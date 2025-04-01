import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConnectButton } from './ConnectButton';
import { ConnectWalletText } from './ConnectWalletText';

describe('ConnectButton', () => {
  it('should render connect button', () => {
    render(
      <ConnectButton
        connectWalletText="Connect Wallet"
        onClick={vi.fn()}
        text="text"
      />,
    );
    const button = screen.getByTestId('ockConnectButton');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Connect Wallet');
  });

  it('should render connect button with custom text', () => {
    render(
      <ConnectButton
        connectWalletText={
          <ConnectWalletText>Connect Dope Wallet</ConnectWalletText>
        }
        onClick={vi.fn()}
        text="text"
      />,
    );
    const button = screen.getByTestId('ockConnectButton');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Connect Dope Wallet');
  });

  it('should render connect button with custom text and custom class', () => {
    render(
      <ConnectButton
        className="custom-class"
        connectWalletText="Connect Dope Wallet"
        onClick={vi.fn()}
        text="text"
      />,
    );
    const button = screen.getByTestId('ockConnectButton');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Connect Dope Wallet');
    expect(button).toHaveClass('custom-class');
  });
});
