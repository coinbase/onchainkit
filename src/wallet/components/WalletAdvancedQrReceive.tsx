'use client';

import { PressableIcon } from '@/internal/components/PressableIcon';
import { QrCodeSvg } from '@/internal/components/QrCode/QrCodeSvg';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { copySvg } from '@/internal/svg/copySvg';
import { zIndex } from '@/styles/constants';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useCallback, useState } from 'react';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';
import { CopyButton } from '@/internal/components/CopyButton';

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

  const resetAffordanceText = useCallback(() => {
    setTimeout(() => {
      setCopyText('Copy');
      setCopyButtonText('Copy address');
    }, 2000);
  }, []);

  const handleCopySuccess = useCallback(
    (element: 'button' | 'icon') => {
      if (element === 'button') {
        setCopyButtonText('Address copied');
      } else {
        setCopyText('Copied');
      }
      resetAffordanceText();
    },
    [resetAffordanceText],
  );

  const handleCopyError = useCallback(
    (element: 'button' | 'icon') => {
      if (element === 'button') {
        setCopyButtonText('Failed to copy address');
      } else {
        setCopyText('Failed to copy');
      }
      resetAffordanceText();
    },
    [resetAffordanceText],
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
          <CopyButton
            label={copySvg}
            copyValue={address ?? ''}
            onSuccess={() => handleCopySuccess('icon')}
            onError={() => handleCopyError('icon')}
            className={cn(
              pressable.default,
              border.radiusInner,
              border.default,
              'flex items-center justify-center p-2',
            )}
          />
          <CopyButton
            label={copyText}
            copyValue={address ?? ''}
            onSuccess={() => handleCopySuccess('icon')}
            onError={() => handleCopyError('icon')}
            className={cn(
              pressable.alternate,
              text.legal,
              color.foreground,
              border.default,
              border.radius,
              zIndex.dropdown,
              'absolute top-full right-0 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
            )}
            aria-label="Copy your address"
          />
        </div>
      </div>
      <QrCodeSvg value={address} />
      <CopyButton
        copyValue={address ?? ''}
        label={copyButtonText}
        className={cn(border.radius, pressable.alternate, 'w-full p-3')}
        onSuccess={() => handleCopySuccess('button')}
        onError={() => handleCopyError('button')}
      />
    </div>
  );
}
