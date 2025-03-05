import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WalletDropdownLink } from './WalletDropdownLink';

describe('WalletDropdownLink', () => {
  it('renders correctly with default props', () => {
    render(
      <WalletDropdownLink href="https://example.com">
        Link Text
      </WalletDropdownLink>,
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByText('Link Text')).toBeInTheDocument();
  });

  it('renders correctly with icon prop', () => {
    render(
      <WalletDropdownLink icon="wallet" href="https://example.com">
        Link Text
      </WalletDropdownLink>,
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByText('Link Text')).toBeInTheDocument();
    expect(screen.getByLabelText('ock-walletSvg')).toBeInTheDocument();
  });

  it('renders correctly with custom icon element', () => {
    const customIcon = <svg aria-label="custom-icon" />;
    render(
      <WalletDropdownLink icon={customIcon} href="https://example.com">
        Link Text
      </WalletDropdownLink>,
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
    expect(screen.getByText('Link Text')).toBeInTheDocument();
    expect(screen.getByLabelText('custom-icon')).toBeInTheDocument();
  });

  it('renders correctly with target and rel attributes', () => {
    render(
      <WalletDropdownLink
        href="https://example.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Link Text
      </WalletDropdownLink>,
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://example.com');
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByText('Link Text')).toBeInTheDocument();
  });
});
