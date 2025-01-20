'use client';

import { copyToClipboard } from '@/core/utils/copyToClipboard';
import { PressableIcon } from '@/internal/components/PressableIcon';
import { QrCodeSvg } from '@/internal/components/QrCode/QrCodeSvg';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { copySvg } from '@/internal/svg/copySvg';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useCallback, useState } from 'react';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';

export function WalletAdvancedQrReceive() {
  const { address, isSubComponentClosing } = useWalletContext();
  const { setShowQr, isQrClosing, setIsQrClosing } = useWalletAdvancedContext();
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
      const resetAffordanceText = () => {
        setTimeout(() => {
          setCopyText('Copy');
          setCopyButtonText('Copy address');
        }, 2000);
      };

      await copyToClipboard({
        text: address ?? '',
        onSuccess: () => {
          element === 'button'
            ? setCopyButtonText('Address copied')
            : setCopyText('Copied');
          resetAffordanceText();
        },
        onError: (err: unknown) => {
          console.error('Failed to copy address:', err);
          element === 'button'
            ? setCopyButtonText('Failed to copy address')
            : setCopyText('Failed to copy');
          resetAffordanceText();
        },
      });
    },
    [address],
  );

  if (isSubComponentClosing) {
    return null;
  }

  return (
    <div
      data-testid="ockWalletAdvancedQrReceive"
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
              data-testid="ockWalletAdvancedQrReceive_CopyIcon"
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
            data-testid="ockWalletAdvancedQrReceive_CopyTooltip"
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
        data-testid="ockWalletAdvancedQrReceive_CopyButton"
      >
        {copyButtonText}
      </button>
    </div>
  );
}
