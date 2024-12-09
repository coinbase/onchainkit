import { useCallback, useEffect, useRef, useState } from 'react';
import { useConnect } from 'wagmi';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';
import { closeSvg } from '../../internal/svg/closeSvg';
import { coinbaseWalletSvg } from '../../internal/svg/coinbaseWalletSvg';
import { defaultAvatarSVG } from '../../internal/svg/defaultAvatarSVG';
import { metamaskSvg } from '../../internal/svg/metamaskSvg';
import {
  background,
  border,
  cn,
  color,
  pressable,
  text,
} from '../../styles/theme';
import { useOnchainKit } from '../../useOnchainKit';

type WalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onError?: (error: Error) => void;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ignore
export function WalletModal({
  isOpen,
  onClose,
  className,
  onError,
}: WalletModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const { connect, connectors } = useConnect();
  const { config } = useOnchainKit();

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle focus trap and keyboard interactions
  useEffect(() => {
    if (!isOpen || !modalRef.current) {
      return;
    }

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO: Refactor
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        } else if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const appLogo = config?.appearance?.logo;
  const appName = config?.appearance?.name;
  const privacyPolicyUrl = config?.wallet?.privacyUrl ?? undefined;
  const termsOfServiceUrl = config?.wallet?.termsUrl ?? undefined;

  const handleCoinbaseWalletConnection = useCallback(() => {
    try {
      const cbConnector = coinbaseWallet({
        preference: 'all',
      });

      connect({ connector: cbConnector });
      onClose();
    } catch (error) {
      console.error('Coinbase Wallet connection error:', error);
      if (onError) {
        onError(
          error instanceof Error
            ? error
            : new Error('Failed to connect wallet'),
        );
      }
    }
  }, [connect, onClose, onError]);

  const handleMetaMaskConnection = useCallback(() => {
    try {
      const metamaskConnector = metaMask({
        dappMetadata: {
          name: appName || 'OnchainKit App',
          url: window.location.origin,
          iconUrl: appLogo || undefined,
        },
      });

      connect({ connector: metamaskConnector });
      onClose();
    } catch (error) {
      console.error('MetaMask connection error:', error);
      if (onError) {
        onError(
          error instanceof Error
            ? error
            : new Error('Failed to connect wallet'),
        );
      }
    }
  }, [connect, onClose, onError, appName, appLogo]);

  const handlePhantomConnection = useCallback(() => {
    try {
      // Find the Phantom connector from available connectors
      const phantomConnector = connectors.find(
        (c) => c.name.toLowerCase() === 'phantom',
      );

      if (!phantomConnector) {
        throw new Error('Phantom connector not found');
      }

      // Check if Phantom is installed
      if (typeof window !== 'undefined' && !window.phantom) {
        window.open('https://phantom.app/', '_blank');
        throw new Error('Phantom wallet is not installed');
      }

      connect({ connector: phantomConnector });
      onClose();
    } catch (error) {
      console.error('Phantom connection error:', error);
      if (onError) {
        onError(
          error instanceof Error
            ? error
            : new Error('Failed to connect wallet'),
        );
      }
    }
  }, [connect, connectors, onClose, onError]);

  const handleLinkKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/70 transition-opacity duration-200',
        isOpen ? 'opacity-100' : 'opacity-0',
        className,
      )}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Enter' && onClose()}
      role="presentation"
      data-testid="ockModalOverlay"
    >
      <div
        ref={modalRef}
        className={cn(
          border.lineDefault,
          border.radius,
          background.default,
          'w-[323px] p-6 pb-4',
          'flex flex-col items-center gap-4',
          'relative',
          '-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2',
          'transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Enter' && e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'absolute top-4 right-4',
            'flex items-center justify-center p-1',
            'transition-colors duration-200',
          )}
          aria-label="Close modal"
        >
          <div className={cn('flex h-4 w-4 items-center justify-center')}>
            {closeSvg}
          </div>
        </button>

        {(appLogo || appName) && (
          <div className="flex w-full flex-col items-center gap-3 p-2">
            {appLogo && (
              <div className={cn(border.radius, 'h-14 w-14 overflow-hidden')}>
                <img
                  src={appLogo}
                  alt={`${appName || 'App'} icon`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {appName && (
              <h2
                className={cn(text.headline, color.foreground, 'text-center')}
              >
                {appName}
              </h2>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleCoinbaseWalletConnection}
            className={cn(
              border.radiusInner,
              text.body,
              pressable.alternate,
              color.foreground,
              'h-10 w-[275px] px-4 py-3',
              'flex items-center justify-between text-left',
            )}
          >
            Sign up
            <div className="h-4 w-4">{defaultAvatarSVG}</div>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div
                className={cn(border.lineDefault, 'w-full border-[0.5px]')}
              />
            </div>
            <div className="relative flex justify-center">
              <span
                className={cn(
                  background.default,
                  color.foregroundMuted,
                  text.legal,
                  'px-2',
                )}
              >
                or continue with an existing wallet
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCoinbaseWalletConnection}
            className={cn(
              border.radiusInner,
              text.body,
              pressable.alternate,
              color.foreground,
              'h-10 w-[275px] px-4 py-3',
              'flex items-center justify-between text-left',
            )}
          >
            Coinbase Wallet
            <div className="h-4 w-4">{coinbaseWalletSvg}</div>
          </button>

          <button
            type="button"
            onClick={handleMetaMaskConnection}
            className={cn(
              border.radiusInner,
              text.body,
              pressable.alternate,
              color.foreground,
              'flex h-[40px] w-[275px] px-4 py-3',
              'items-center justify-between text-left',
            )}
          >
            MetaMask
            <div className="h-4 w-4">{metamaskSvg}</div>
          </button>

          <button
            type="button"
            onClick={handlePhantomConnection}
            className={cn(
              border.radiusInner,
              text.body,
              pressable.alternate,
              color.foreground,
              'flex h-[40px] w-[275px] px-4 py-3',
              'items-center justify-between text-left',
            )}
          >
            Phantom
            <div className="h-4 w-4">
              <svg
                viewBox="0 0 128 128"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="128" height="128" rx="64" fill="#AB9FF2" />
                <path
                  d="M110.584 64.9142H99.142C99.142 41.7651 80.173 23 56.7724 23C33.6612 23 14.8716 41.3057 14.4118 64.0583C13.936 87.577 36.241 107 60.0186 107H63.0094C83.9723 107 112.069 91.7667 116.459 71.9874C117.27 68.3413 114.358 64.9142 110.584 64.9142ZM39.7689 65.9454C39.7689 69.0411 37.2095 71.5729 34.0802 71.5729C30.9509 71.5729 28.3916 69.0411 28.3916 65.9454V56.9338C28.3916 53.8381 30.9509 51.3063 34.0802 51.3063C37.2095 51.3063 39.7689 53.8381 39.7689 56.9338V65.9454ZM59.5224 65.9454C59.5224 69.0411 56.963 71.5729 53.8337 71.5729C50.7044 71.5729 48.145 69.0411 48.145 65.9454V56.9338C48.145 53.8381 50.7044 51.3063 53.8337 51.3063C56.963 51.3063 59.5224 53.8381 59.5224 56.9338V65.9454Z"
                  fill="white"
                />
              </svg>
            </div>
          </button>
        </div>

        <div
          className={cn(
            color.foregroundMuted,
            text.legal,
            'flex flex-col items-center justify-center gap-1 px-4',
            'mt-4 w-[275px] text-center',
          )}
        >
          <span className="font-normal text-[10px] leading-[13px]">
            By connecting a wallet, you agree to our
          </span>
          <span className="font-normal text-[10px] leading-[13px]">
            {termsOfServiceUrl && (
              <a
                href={termsOfServiceUrl}
                className={cn(color.primary, 'hover:underline')}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={0}
                onKeyDown={(e) => handleLinkKeyDown(e, termsOfServiceUrl)}
              >
                Terms of Service
              </a>
            )}{' '}
            {termsOfServiceUrl && privacyPolicyUrl && 'and'}{' '}
            {privacyPolicyUrl && (
              <a
                href={privacyPolicyUrl}
                className={cn(color.primary, 'hover:underline')}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={0}
                onKeyDown={(e) => handleLinkKeyDown(e, privacyPolicyUrl)}
              >
                Privacy Policy
              </a>
            )}
            .
          </span>
        </div>
      </div>
    </div>
  );
}
