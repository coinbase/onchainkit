import { useCallback, useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (showQr) {
      backButtonRef.current?.focus();
    }
  }, [showQr]);

  const handleCloseQr = useCallback(() => {
    setShowQr(false);
  }, [setShowQr]);

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address ?? '');
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  }, [address]);

  if (isClosing) {
    return null;
  }

  return (
    <div
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
        >
          {backArrowSvg}
        </button>
        <span>Scan to receive</span>
        <button
          type="button"
          onClick={handleCopyAddress}
          className={cn(
            pressable.default,
            border.radius,
            border.default,
            'flex items-center justify-center p-3',
          )}
        >
          {copySvg}
        </button>
      </div>

      <QRCodeComponent value={address ? `ethereum:${address}` : ''} />

      <button
        type="button"
        className={cn(border.radius, pressable.alternate, 'w-full p-3')}
        onClick={handleCopyAddress}
      >
        <span>Copy address</span>
      </button>
    </div>
  );
}
