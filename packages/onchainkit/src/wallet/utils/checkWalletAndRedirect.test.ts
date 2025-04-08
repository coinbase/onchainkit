import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  isWalletInstalled,
  WindowWithPhantom,
  redirectToWalletInstall,
  checkWalletAndRedirect,
  WALLET_INSTALL_URLS,
} from './checkWalletAndRedirect';

describe('isWalletInstalled', () => {
  const originalWindow = { ...window };

  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(window, 'ethereum', {
      writable: true,
      value: undefined,
    });

    Object.defineProperty(window as WindowWithPhantom, 'phantom', {
      writable: true,
      value: undefined,
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'ethereum', {
      writable: true,
      value: originalWindow.ethereum,
    });
  });

  describe('when window is undefined', () => {
    let originalWindowRef: Window;

    beforeEach(() => {
      originalWindowRef = global.window;

      Object.defineProperty(global, 'window', {
        configurable: true,
        get: () => undefined,
      });
    });

    afterEach(() => {
      Object.defineProperty(global, 'window', {
        configurable: true,
        get: () => originalWindowRef,
      });
    });

    it('returns false for any wallet type when window is undefined', () => {
      expect(isWalletInstalled('phantom')).toBe(false);
      expect(isWalletInstalled('rabby')).toBe(false);
      expect(isWalletInstalled('trust')).toBe(false);
      expect(isWalletInstalled('frame')).toBe(false);
      expect(isWalletInstalled('unknown')).toBe(false);
    });
  });

  describe('when window.ethereum is undefined', () => {
    it('returns false for unsupported wallet types', () => {
      expect(isWalletInstalled('unknown')).toBe(false);
      expect(isWalletInstalled('rabby')).toBe(false);
      expect(isWalletInstalled('trust')).toBe(false);
      expect(isWalletInstalled('frame')).toBe(false);
    });

    it('returns false for phantom when phantom object is not present', () => {
      expect(isWalletInstalled('phantom')).toBe(false);
    });

    it('returns true for phantom when phantom.ethereum.isPhantom is true', () => {
      Object.defineProperty(window as WindowWithPhantom, 'phantom', {
        writable: true,
        value: {
          ethereum: {
            isPhantom: true,
          },
        },
      });

      expect(isWalletInstalled('phantom')).toBe(true);
    });
  });

  describe('when window.ethereum is defined', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'ethereum', {
        writable: true,
        value: {},
      });
    });

    it('returns false for unsupported wallet types', () => {
      expect(isWalletInstalled('unknown')).toBe(false);
    });

    it('returns true for phantom when window.ethereum.isPhantom is true', () => {
      window.ethereum.isPhantom = true;
      expect(isWalletInstalled('phantom')).toBe(true);
    });

    it('returns true for phantom when window.phantom.ethereum.isPhantom is true', () => {
      Object.defineProperty(window as WindowWithPhantom, 'phantom', {
        writable: true,
        value: {
          ethereum: {
            isPhantom: true,
          },
        },
      });

      expect(isWalletInstalled('phantom')).toBe(true);
    });

    it('returns true for rabby when window.ethereum.isRabby is true', () => {
      window.ethereum.isRabby = true;
      expect(isWalletInstalled('rabby')).toBe(true);
    });

    it('returns true for trust when window.ethereum.isTrust is true', () => {
      window.ethereum.isTrust = true;
      expect(isWalletInstalled('trust')).toBe(true);
    });

    it('returns true for trust when window.ethereum.isTrustWallet is true', () => {
      window.ethereum.isTrustWallet = true;
      expect(isWalletInstalled('trust')).toBe(true);
    });

    it('returns true for frame when window.ethereum.isFrame is true', () => {
      window.ethereum.isFrame = true;
      expect(isWalletInstalled('frame')).toBe(true);
    });

    it('returns false when wallet flag is not set', () => {
      expect(isWalletInstalled('phantom')).toBe(false);
      expect(isWalletInstalled('rabby')).toBe(false);
      expect(isWalletInstalled('trust')).toBe(false);
      expect(isWalletInstalled('frame')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('handles both phantom detection methods correctly', () => {
      Object.defineProperty(window, 'ethereum', {
        writable: true,
        value: { isPhantom: true },
      });
      expect(isWalletInstalled('phantom')).toBe(true);

      Object.defineProperty(window, 'ethereum', {
        writable: true,
        value: {},
      });
      Object.defineProperty(window as WindowWithPhantom, 'phantom', {
        writable: true,
        value: {
          ethereum: {
            isPhantom: true,
          },
        },
      });
      expect(isWalletInstalled('phantom')).toBe(true);

      Object.defineProperty(window, 'ethereum', {
        writable: true,
        value: { isPhantom: true },
      });
      expect(isWalletInstalled('phantom')).toBe(true);
    });
  });
});

describe('redirectToWalletInstall', () => {
  const originalWindowOpen = window.open;

  beforeEach(() => {
    window.open = vi.fn();
  });

  afterEach(() => {
    window.open = originalWindowOpen;
  });

  it('redirects to the correct installation URL for supported wallets', () => {
    expect(redirectToWalletInstall('phantom')).toBe(true);
    expect(window.open).toHaveBeenCalledWith(
      WALLET_INSTALL_URLS.phantom,
      '_blank',
      'noopener,noreferrer',
    );

    expect(redirectToWalletInstall('rabby')).toBe(true);
    expect(window.open).toHaveBeenCalledWith(
      WALLET_INSTALL_URLS.rabby,
      '_blank',
      'noopener,noreferrer',
    );

    expect(redirectToWalletInstall('trust')).toBe(true);
    expect(window.open).toHaveBeenCalledWith(
      WALLET_INSTALL_URLS.trust,
      '_blank',
      'noopener,noreferrer',
    );

    expect(redirectToWalletInstall('frame')).toBe(true);
    expect(window.open).toHaveBeenCalledWith(
      WALLET_INSTALL_URLS.frame,
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('returns false and does not redirect for unsupported wallet types', () => {
    expect(redirectToWalletInstall('unsupported')).toBe(false);
    expect(window.open).not.toHaveBeenCalled();
  });
});

describe('checkWalletAndRedirect', () => {
  const originalWindowOpen = window.open;
  const originalWindow = { ...window };

  beforeEach(() => {
    window.open = vi.fn();
    vi.clearAllMocks();

    Object.defineProperty(window, 'ethereum', {
      writable: true,
      value: undefined,
    });

    Object.defineProperty(window as WindowWithPhantom, 'phantom', {
      writable: true,
      value: undefined,
    });
  });

  afterEach(() => {
    window.open = originalWindowOpen;

    Object.defineProperty(window, 'ethereum', {
      writable: true,
      value: originalWindow.ethereum,
    });
  });

  it('returns true and does not redirect if wallet is installed', () => {
    Object.defineProperty(window, 'ethereum', {
      writable: true,
      value: { isPhantom: true },
    });

    expect(checkWalletAndRedirect('phantom')).toBe(true);
    expect(window.open).not.toHaveBeenCalled();
  });

  it('returns false and redirects if wallet is not installed', () => {
    expect(checkWalletAndRedirect('phantom')).toBe(false);
    expect(window.open).toHaveBeenCalledWith(
      WALLET_INSTALL_URLS.phantom,
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('returns false and redirects for supported but not installed wallets', () => {
    expect(checkWalletAndRedirect('rabby')).toBe(false);
    expect(window.open).toHaveBeenCalledWith(
      WALLET_INSTALL_URLS.rabby,
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('returns false and does not redirect for unsupported wallet types', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = checkWalletAndRedirect('unsupported');
    expect(result).toBe(false);
    expect(window.open).not.toHaveBeenCalled();
  });
});
