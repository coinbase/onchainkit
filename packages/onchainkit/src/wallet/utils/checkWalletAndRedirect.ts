/**
 * Phantom wallet uses dual injection:
 * - window.phantom object
 * - window.ethereum.isPhantom flag (when active)
 * This interface adds type safety for the non-standard window.phantom property.
 */
export interface WindowWithPhantom extends Window {
  phantom?: {
    ethereum?: {
      isPhantom?: boolean;
    };
  };
}

export function isWalletInstalled(walletType: string): boolean {
  // Check if we're in a non-browser environment (e.g., SSR/Node.js)
  // This prevents ReferenceError when window is not defined
  if (typeof window === 'undefined') {
    return false;
  }

  // Handle case when window.ethereum is undefined
  // This can happen in browsers without any wallet extensions installed
  // or when the wallet extension hasn't injected its provider yet
  if (!window.ethereum) {
    // Special case for Phantom which has dual injection pattern:
    // It can be detected via window.phantom even when window.ethereum is undefined
    if (walletType === 'phantom') {
      return !!(window as WindowWithPhantom).phantom?.ethereum?.isPhantom;
    }
    return false;
  }

  switch (walletType) {
    case 'phantom':
      return (
        !!(window as WindowWithPhantom).phantom?.ethereum?.isPhantom ||
        !!window.ethereum.isPhantom
      );
    case 'rabby':
      return !!window.ethereum.isRabby;
    case 'trust':
      return !!window.ethereum.isTrust || !!window.ethereum.isTrustWallet;
    case 'frame':
      return !!window.ethereum.isFrame;
    default:
      return false;
  }
}

/**
 * Wallet installation URLs
 * Note: MetaMask and Coinbase Wallet are not included here as they have built-in
 * redirection mechanisms in their connectors.
 */
export const WALLET_INSTALL_URLS: Record<string, string> = {
  phantom: 'https://phantom.app/download',
  rabby: 'https://rabby.io',
  trust: 'https://trustwallet.com/download',
  frame: 'https://frame.sh',
};

export function redirectToWalletInstall(walletType: string): boolean {
  const url = WALLET_INSTALL_URLS[walletType];
  if (!url) {
    return false;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

/**
 * Check if the wallet is installed, and redirect to installation page if not
 */
export function checkWalletAndRedirect(walletType: string): boolean {
  const isInstalled = isWalletInstalled(walletType);

  if (!isInstalled) {
    redirectToWalletInstall(walletType);
  }

  return isInstalled;
}
