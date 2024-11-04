import { version } from '../../version.js';
const COINBASE_SMART_WALLET_FUND_URL = 'https://keys.coinbase.com/fund';

/**
 * Builds the URL for the Coinbase Smart Wallet funding page, including parameters to identify the dApp based on the
 * document title and current URL.
 * @returns the URL
 */
function getCoinbaseSmartWalletFundUrl() {
  const currentURL = window.location.href;
  const tabName = document.title;
  const fundUrl = `${COINBASE_SMART_WALLET_FUND_URL}?dappName=${encodeURIComponent(tabName)}&dappUrl=${encodeURIComponent(currentURL)}&version=${encodeURIComponent(version)}&source=onchainkit`;
  return fundUrl;
}
export { getCoinbaseSmartWalletFundUrl };
//# sourceMappingURL=getCoinbaseSmartWalletFundUrl.js.map
