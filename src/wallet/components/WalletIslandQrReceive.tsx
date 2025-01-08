import { PressableIcon } from '@/internal/components/PressableIcon';
import { QrCodeSvg } from '@/internal/components/QrCode/QrCodeSvg';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { copySvg } from '@/internal/svg/copySvg';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useCallback, useState } from 'react';
import { useWalletIslandContext } from './WalletIslandProvider';
import { useWalletContext } from './WalletProvider';

export function WalletIslandQrReceive() {
  const { address, isClosing } = useWalletContext();
  const { setShowQr, isQrClosing, setIsQrClosing } = useWalletIslandContext();
  const [copyText, setCopyText] = useState('Copy');
  const [copyButtonText, setCopyButtonText] = useState('Copy address');

  const handleCloseQr = useCallback(() => {
    setIsQrClosing(true);

    setTimeout(() => {
      setShowQr(false);
    }, 200);

    setTimeout(() => {
      setIsQrClosing(false);
    }, 400);
  }, [setShowQr, setIsQrClosing]);

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
        'flex flex-col items-center justify-between',
        'h-full w-full',
        'px-4 pt-3 pb-4',
        isQrClosing
          ? 'fade-out slide-out-to-left-5 animate-out fill-mode-forwards ease-in-out'
          : 'fade-in slide-in-from-left-5 linear animate-in duration-150',
      )}
    >
      <div className="flex h-[34px] w-full flex-row items-center justify-between">
        <PressableIcon>
          <button type="button" onClick={handleCloseQr} aria-label="Back">
            <div className="p-2">{backArrowSvg}</div>
          </button>
        </PressableIcon>
        <span>Scan to receive</span>
        <div className="group relative">
          <PressableIcon>
            <button
              type="button"
              onClick={() => handleCopyAddress('icon')}
              aria-label="Copy your address"
            >
              <div className="p-2">{copySvg}</div>
            </button>
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
          >
            {copyText}
          </button>
        </div>
      </div>
      <QrCodeSvg value={address ? `ethereum:${address}` : ''} />
      <button
        type="button"
        className={cn(border.radius, pressable.alternate, 'w-full p-3')}
        onClick={() => handleCopyAddress('button')}
        aria-label="Copy your address"
      >
        {copyButtonText}
      </button>
    </div>
  );
}
