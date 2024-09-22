import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { useIsWalletACoinbaseSmartWallet } from '../hooks/useIsWalletACoinbaseSmartWallet';
import { WalletDropdownFundLink } from './WalletDropdownFundLink';

vi.mock('../hooks/useIsWalletACoinbaseSmartWallet', () => ({
  useIsWalletACoinbaseSmartWallet: vi.fn(),
}));

const mockWalletDropdownFundLinkButton = vi.fn();
vi.mock('./WalletDropdownFundLinkButton', () => ({
  WalletDropdownFundLinkButton: (props) => {
    mockWalletDropdownFundLinkButton(props);
    return <div />;
  }
}));

const mockWalletDropdownFundLinkCoinbaseSmartWallet = vi.fn();
vi.mock('./WalletDropdownFundLinkCoinbaseSmartWallet', () => ({
  WalletDropdownFundLinkCoinbaseSmartWallet: (props) => {
    mockWalletDropdownFundLinkCoinbaseSmartWallet(props);
    return <div />;
  }
}));

const mockWalletDropdownFundLinkEOAWallet = vi.fn();
vi.mock('./WalletDropdownFundLinkEOAWallet', () => ({
  WalletDropdownFundLinkEOAWallet: (props) => {
    mockWalletDropdownFundLinkEOAWallet(props);
    return <div />;
  }
}));

describe('WalletDropdownFund', () => {
  it('renders the fund link button when fundingUrl is passed as a prop', () => {
    //(useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);

    render(<WalletDropdownFundLink fundingUrl="https://wallet.fund" />);

    expect(mockWalletDropdownFundLinkButton).toHaveBeenCalledWith(
      expect.objectContaining({
        fundingUrl: 'https://wallet.fund',
      })
    );
  });

  it('renders the Coinbase Smart Wallet fund link when the connected wallet is a Coinbase Smart Wallet', () => {
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(true);

    render(<WalletDropdownFundLink />);

    expect(mockWalletDropdownFundLinkCoinbaseSmartWallet).toHaveBeenCalled();
  });

  it('renders the EOA wallet fund link when the connected wallet is an EOA wallet', () => {
    (useIsWalletACoinbaseSmartWallet as Mock).mockReturnValue(false);

    render(<WalletDropdownFundLink />);

    expect(mockWalletDropdownFundLinkEOAWallet).toHaveBeenCalled();
  });
});
