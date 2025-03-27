'use client';

import { Dialog } from '@/internal/components/Dialog';
import { CloseSvg } from '@/internal/svg/closeSvg';
import { coinbaseWalletSvg } from '@/internal/svg/coinbaseWalletSvg';
import { defaultAvatarSVG } from '@/internal/svg/defaultAvatarSVG';
// import { metamaskSvg } from '@/internal/svg/metamaskSvg';
import { browserWalletIconSvg } from '@/internal/svg/browserWalletIconSvg';
import { background, border, cn, color, pressable, text } from '@/styles/theme';
import { useOnchainKit } from '@/useOnchainKit';
import { useCallback, useEffect, useState } from 'react';
import { useConnect } from 'wagmi';
import { coinbaseWallet, injected, metaMask } from 'wagmi/connectors';

type WalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onError?: (error: Error) => void;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ignore
export function WalletModal({
  className,
  isOpen,
  onClose,
  onError,
}: WalletModalProps) {
  const { connect } = useConnect();
  const { config } = useOnchainKit();

  const appLogo = config?.appearance?.logo ?? undefined;
  const appName = config?.appearance?.name ?? undefined;
  const privacyPolicyUrl = config?.wallet?.privacyUrl ?? undefined;
  const termsOfServiceUrl = config?.wallet?.termsUrl ?? undefined;

  const handleCoinbaseWalletConnection = useCallback(() => {
    try {
      const cbConnector = coinbaseWallet({
        preference: 'all',
        appName,
        appLogoUrl: appLogo,
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
  }, [appName, appLogo, connect, onClose, onError]);

  const handleMetaMaskConnection = useCallback(() => {
    try {
      const metamaskConnector = metaMask({
        dappMetadata: {
          name: appName || 'OnchainKit App',
          url: window.location.origin,
          iconUrl: appLogo,
        },
      });

      connect({ connector: metamaskConnector });
      onClose();
    } catch (error) {
      console.error('MetaMask connection error:', error);
      onError?.(
        error instanceof Error ? error : new Error('Failed to connect wallet'),
      );
    }
  }, [connect, onClose, onError, appName, appLogo]);

  const handlePhantomConnection = useCallback(() => {
    try {
      const phantomConnector = injected();

      connect({ connector: phantomConnector });
      onClose();
    } catch (error) {
      console.error('Phantom connection error:', error);
      onError?.(
        error instanceof Error ? error : new Error('Failed to connect wallet'),
      );
    }
  }, [connect, onClose, onError]);

  const [isBrowserWalletInstalled, setIsBrowserWalletInstalled] = useState(false);

  useEffect(() => {
    // This code only runs on the client
    if (typeof window !== 'undefined' && window.ethereum) {
      setIsBrowserWalletInstalled(true);
    }
  }, []);

  return (
    <Dialog isOpen={isOpen} onClose={onClose} aria-label="Connect Wallet">
      <div
        data-testid="ockModalOverlay"
        className={cn(
          border.lineDefault,
          border.radius,
          background.default,
          'w-[22rem] p-6 pb-4',
          'relative flex flex-col items-center gap-4',
          className,
        )}
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
            'bg-current',
            'transition-colors duration-200',
          )}
          aria-label="Close modal"
        >
          <div className={cn('flex h-4 w-4 items-center justify-center')}>
            <CloseSvg />
          </div>
        </button>

        {(appLogo || appName) && (
          <div className="flex w-full flex-col items-center gap-2 py-3">
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

        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={handleCoinbaseWalletConnection}
            className={cn(
              border.radius,
              text.body,
              pressable.alternate,
              color.foreground,
              'flex items-center justify-between px-4 py-3 text-left',
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

          {isBrowserWalletInstalled &&
            <button
              type="button"
              onClick={handlePhantomConnection}
              className={cn(
                border.radius,
                background.default,
                text.body,
                pressable.alternate,
                color.foreground,
                'flex items-center justify-between px-4 py-3 text-left',
              )}
            >
              Browser Wallet
              <div className="-mr-0.5 flex h-4 w-4 items-center justify-center">
                {browserWalletIconSvg}
              </div>
            </button>
          }

          <button
            type="button"
            onClick={handleCoinbaseWalletConnection}
            className={cn(
              border.radius,
              background.default,
              text.body,
              pressable.alternate,
              color.foreground,
              'px-4 py-3',
              'flex items-center justify-between text-left',
            )}
          >
            Coinbase Wallet
            <div className="h-4 w-4">{coinbaseWalletSvg}</div>
          </button>
        </div>
        <div
          className={cn(
            color.foregroundMuted,
            text.legal,
            'flex flex-col items-center justify-center gap-1 px-4',
            'mt-4 text-center',
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
              >
                Privacy Policy
              </a>
            )}
            .
          </span>
        </div>
      </div>
    </Dialog>
  );
}
