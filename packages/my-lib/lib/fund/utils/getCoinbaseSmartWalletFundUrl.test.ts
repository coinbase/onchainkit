import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCoinbaseSmartWalletFundUrl } from './getCoinbaseSmartWalletFundUrl';

vi.mock('../../version', () => ({
  version: '0.0.1',
}));

describe('WalletDropdownFundLinkCoinbaseSmartWallet', () => {
  beforeEach(() => {
    // Mock window.location
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      href: 'http://localhost:3000/',
    } as Location);

    // Mock document.title
    Object.defineProperty(document, 'title', {
      value: 'myDapp',
      writable: true,
    });
  });

  it('should return the Coinbase Smart Wallet fund URL with correct query params', () => {
    const url = getCoinbaseSmartWalletFundUrl();
    expect(url).toEqual(
      'https://keys.coinbase.com/fund?dappName=myDapp&dappUrl=http%3A%2F%2Flocalhost%3A3000%2F&version=0.0.1&source=onchainkit',
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
});
