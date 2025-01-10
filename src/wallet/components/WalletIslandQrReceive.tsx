import { PressableIcon } from '@/internal/components/PressableIcon';
import { QrCodeSvg } from '@/internal/components/QrCode/QrCodeSvg';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { copySvg } from '@/internal/svg/copySvg';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useCallback, useState } from 'react';
import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

export function WalletIslandQrReceive() {
  const { address, isSubComponentClosing } = useWalletContext();
  const { setShowQr, isQrClosing, setIsQrClosing } = useWalletIslandContext();
  const [copyText, setCopyText] = useState('Copy');
  const [copyButtonText, setCopyButtonText] = useState('Copy address');

  const handleCloseQr = useCallback(() => {
    setIsQrClosing(true);
  }, [setIsQrClosing]);

  const handleAnimationEnd = useCallback(() => {
    if (isQrClosing) {
      setShowQr(false);
      setIsQrClosing(false);
    }
  }, [isQrClosing, setShowQr, setIsQrClosing]);

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

  if (isSubComponentClosing) {
    return null;
  }

  return (
    <div
      data-testid="ockWalletIslandQrReceive"
      className={cn(
        color.foreground,
        text.headline,
        'flex flex-col items-center justify-between',
        'h-full w-full',
        'px-4 pt-3 pb-4',
        isQrClosing
          ? 'fade-out slide-out-to-left-5 animate-out fill-mode-forwards ease-in-out'
          : 'fade-in slide-in-from-left-5 linear animate-in duration-150',
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="flex h-[34px] w-full flex-row items-center justify-between">
        <PressableIcon ariaLabel="Back button" onClick={handleCloseQr}>
          <div className="p-2">{backArrowSvg}</div>
        </PressableIcon>
        <span>Scan to receive</span>
        <div className="group relative">
          <PressableIcon
            ariaLabel="Copy your address"
            onClick={() => handleCopyAddress('icon')}
          >
            <div
              className="p-2"
              data-testid="ockWalletIslandQrReceive_CopyIcon"
            >
              {copySvg}
            </div>
          </PressableIcon>
          <button
            type="button"
            onClick={() => handleCopyAddress('icon')}
            className={cn(
              pressable.alternate,
              text.legal,
              color.foreground,
              border.default,
              border.radius,
              'absolute top-full right-0 z-10 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
            )}
            aria-live="polite"
            aria-label="Copy your address"
            data-testid="ockWalletIslandQrReceive_CopyTooltip"
          >
            {copyText}
          </button>
        </div>
      </div>
      <QrCodeSvg value={address} />
      <button
        type="button"
        className={cn(border.radius, pressable.alternate, 'w-full p-3')}
        onClick={() => handleCopyAddress('button')}
        aria-label="Copy your address"
        data-testid="ockWalletIslandQrReceive_CopyButton"
      >
        {copyButtonText}
      </button>
    </div>
  );
}
