import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { getCoinbaseSmartWalletFundUrl } from '../../fund/utils/getCoinbaseSmartWalletFundUrl';
import { WalletDropdownFundLinkCoinbaseSmartWallet } from './WalletDropdownFundLinkCoinbaseSmartWallet';

vi.mock('../../fund/utils/getCoinbaseSmartWalletFundUrl', () => ({
  getCoinbaseSmartWalletFundUrl: vi.fn(),
}));

const mockWalletDropdownFundLinkButton = vi.fn();
vi.mock('./WalletDropdownFundLinkButton', () => ({
  WalletDropdownFundLinkButton: (props) => {
    mockWalletDropdownFundLinkButton(props);
    return <div />;
  },
}));

describe('WalletDropdownFundLinkCoinbaseSmartWallet', () => {
  it('renders the Coinbase Smart Wallet funding link', () => {
    (getCoinbaseSmartWalletFundUrl as Mock).mockReturnValue(
      'https://keys.coinbase.com/fund',
    );

    render(<WalletDropdownFundLinkCoinbaseSmartWallet />);

    expect(mockWalletDropdownFundLinkButton).toHaveBeenCalledWith(
      expect.objectContaining({
        fundingUrl: 'https://keys.coinbase.com/fund',
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
