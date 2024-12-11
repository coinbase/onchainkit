import { useCallback, useEffect, useRef, useState } from 'react';
import { QRCodeComponent } from '../../../internal/components/QrCode/QrCode';
import { backArrowSvg } from '../../../internal/svg/backArrowSvg';
import { copySvg } from '../../../internal/svg/copySvg';
import { border, cn, color, pressable, text } from '../../../styles/theme';
import { useWalletContext } from '../WalletProvider';
import { useWalletIslandContext } from './WalletIslandProvider';

export function WalletIslandQrReceive() {
  const { address, isClosing } = useWalletContext();
  const { showQr, setShowQr } = useWalletIslandContext();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const [copyText, setCopyText] = useState('Copy');
  const [copyButtonText, setCopyButtonText] = useState('Copy address');

  useEffect(() => {
    if (showQr) {
      backButtonRef.current?.focus();
    }
  }, [showQr]);

  const handleCloseQr = useCallback(() => {
    setShowQr(false);
  }, [setShowQr]);

  const handleCopyAddress = useCallback(
    async (element: 'button' | 'icon') => {
      try {
        await navigator.clipboard.writeText(address ?? '');
        if (element === 'button') {
          setCopyButtonText('Address copied');
        } else {
          setCopyText('Copied');
        }
        setTimeout(() => {
          setCopyText('Copy');
          setCopyButtonText('Copy address');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
        if (element === 'button') {
          setCopyButtonText('Failed to copy address');
        } else {
          setCopyText('Failed to copy');
        }
        setTimeout(() => {
          setCopyText('Copy');
          setCopyButtonText('Copy address');
        }, 2000);
      }
    },
    [address],
  );

  if (isClosing) {
    return null;
  }

  return (
    <div
      data-testid="ockWalletIslandQrReceive"
      className={cn(
        color.foreground,
        text.headline,
        'flex flex-col items-center justify-center gap-12',
        'w-full',
        'animate-walletIslandContainerIn',
      )}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <button
          type="button"
          ref={backButtonRef}
          onClick={handleCloseQr}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-3',
          )}
          aria-label="Back"
        >
          {backArrowSvg}
        </button>
        <span>Scan to receive</span>
        <div className="group relative">
          <button
            type="button"
            onClick={() => handleCopyAddress('icon')}
            className={cn(
              pressable.default,
              border.radius,
              border.default,
              'flex items-center justify-center p-3',
            )}
            aria-label="Copy icon"
          >
            {copySvg}
          </button>
          <button
            type="button"
            onClick={() => handleCopyAddress('icon')}
            className={cn(
              pressable.alternate,
              text.legal,
              color.foreground,
              border.default,
              border.radius,
              'absolute top-full right-[0%] z-10 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
            )}
            aria-live="polite"
            aria-label="Copy tooltip"
          >
            {copyText}
          </button>
        </div>
      </div>

      <QRCodeComponent value={address ? `ethereum:${address}` : ''} />

      <button
        type="button"
        className={cn(border.radius, pressable.alternate, 'w-full p-3')}
        onClick={() => handleCopyAddress('button')}
        aria-label="Copy button"
      >
        <span>{copyButtonText}</span>
      </button>
    </div>
  );
}
