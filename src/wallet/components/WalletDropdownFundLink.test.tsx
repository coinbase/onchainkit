import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { WalletDropdownFundLink } from './WalletDropdownFundLink';

const FUNDING_URL =
  'http://keys.coinbase.com/funding?dappName=&dappUrl=http://localhost:3000/';

describe('WalletDropdownFundLink', () => {
  it('renders correctly with default props', () => {
    render(<WalletDropdownFundLink />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', FUNDING_URL);
    expect(screen.getByText('Deposit Funds')).toBeInTheDocument();
  });

  it('renders correctly with custom icon element', () => {
    const customIcon = <svg aria-label="custom-icon" />;
    render(<WalletDropdownFundLink icon={customIcon} />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', FUNDING_URL);
    expect(screen.getByText('Deposit Funds')).toBeInTheDocument();
    expect(screen.getByLabelText('custom-icon')).toBeInTheDocument();
  });

  it('renders correctly with custom text', () => {
    render(<WalletDropdownFundLink text="test" />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', FUNDING_URL);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('opens a new window when clicked with type="window"', () => {
    // Mock window.open
    const mockOpen = vi.fn();
    vi.stubGlobal('open', mockOpen);

    // Mock window.screen
    vi.stubGlobal('screen', { width: 1024, height: 768 });

    render(<WalletDropdownFundLink type="window" />);

    const linkElement = screen.getByText('Deposit Funds');
    fireEvent.click(linkElement);

    // Check if window.open was called with the correct arguments
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('http://keys.coinbase.com/funding'),
      'Coinbase Fund Wallet',
      expect.stringContaining('width=600,height=700'),
    );

    // Clean up
    vi.unstubAllGlobals();
  });
});
