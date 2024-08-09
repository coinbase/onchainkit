import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
    render(
      <WalletDropdownFundLink icon={customIcon}>
        Link Text
      </WalletDropdownFundLink>
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', FUNDING_URL);
    expect(screen.getByText('Link Text')).toBeInTheDocument();
    expect(screen.getByLabelText('custom-icon')).toBeInTheDocument();
  });

  it('renders correctly with target and rel attributes', () => {
    render(
      <WalletDropdownFundLink target="_blank" rel="noopener noreferrer">
        Link Text
      </WalletDropdownFundLink>
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', FUNDING_URL);
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Link Text')).toBeInTheDocument();
  });
});
