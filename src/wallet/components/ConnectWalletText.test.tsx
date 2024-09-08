import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ConnectWalletText } from './ConnectWalletText';

describe('ConnectWalletText', () => {
  it('should render text', () => {
    render(<ConnectWalletText>Connect Dope Wallet</ConnectWalletText>);
    const text = screen.getByText('Connect Dope Wallet');
    expect(text).toBeInTheDocument();
  });

  it('should render text with className', () => {
    render(
      <ConnectWalletText className="custom-class">
        Connect Dope Wallet
      </ConnectWalletText>,
    );
    const text = screen.getByText('Connect Dope Wallet');
    expect(text).toHaveClass('custom-class');
  });
});
