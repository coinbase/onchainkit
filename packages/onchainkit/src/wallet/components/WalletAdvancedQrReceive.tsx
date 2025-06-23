'use client';

import { CopyButton } from '@/internal/components/CopyButton';
import { PressableIcon } from '@/internal/components/PressableIcon';
import { QrCodeSvg } from '@/internal/components/QrCode/QrCodeSvg';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { copySvg } from '@/internal/svg/copySvg';
import { zIndex } from '@/styles/constants';
import { cn, pressable, text } from '@/styles/theme';
import { useCallback, useState } from 'react';
import type { WalletAdvancedQrReceiveProps } from '../types';
import { useWalletContext } from './WalletProvider';

export function WalletAdvancedQrReceive({
  classNames,
}: WalletAdvancedQrReceiveProps) {
  const {
    address,
    setActiveFeature,
    isActiveFeatureClosing,
    setIsActiveFeatureClosing,
  } = useWalletContext();

  const [copyText, setCopyText] = useState('Copy');
  const [copyButtonText, setCopyButtonText] = useState('Copy address');

  const handleCloseQr = useCallback(() => {
    setIsActiveFeatureClosing(true);
  }, [setIsActiveFeatureClosing]);

  const handleAnimationEnd = useCallback(() => {
    if (isActiveFeatureClosing) {
      setActiveFeature(null);
      setIsActiveFeatureClosing(false);
    }
  }, [isActiveFeatureClosing, setActiveFeature, setIsActiveFeatureClosing]);

  const resetAffordanceText = useCallback(() => {
    setTimeout(() => {
      setCopyText('Copy');
      setCopyButtonText('Copy address');
    }, 2000);
  }, []);

  const handleCopyButtonSuccess = useCallback(() => {
    setCopyButtonText('Address copied');
    resetAffordanceText();
  }, [resetAffordanceText]);

  const handleCopyButtonError = useCallback(() => {
    setCopyButtonText('Failed to copy address');
    resetAffordanceText();
  }, [resetAffordanceText]);

  const handleCopyIconSuccess = useCallback(() => {
    setCopyText('Copied');
    resetAffordanceText();
  }, [resetAffordanceText]);

  const handleCopyIconError = useCallback(() => {
    setCopyText('Failed to copy');
    resetAffordanceText();
  }, [resetAffordanceText]);

  return (
    <div
      data-testid="ockWalletAdvancedQrReceive"
      className={cn(
        'rounded-default',
        'text-foreground',
        text.headline,
        'flex flex-col items-center justify-between',
        'h-120 w-88 px-4 pt-3 pb-4',
        isActiveFeatureClosing
          ? 'fade-out slide-out-to-left-5 animate-out fill-mode-forwards ease-in-out'
          : 'fade-in slide-in-from-left-5 linear animate-in duration-150',
        classNames?.container,
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={cn(
          'flex h-[34px] w-full flex-row items-center justify-between',
          classNames?.header,
        )}
      >
        <PressableIcon aria-label="Back button" onClick={handleCloseQr}>
          <div className="p-2">{backArrowSvg}</div>
        </PressableIcon>
        <span>Scan to receive</span>
        <div className="group relative">
          <CopyButton
            label={copySvg}
            copyValue={address ?? ''}
            onSuccess={handleCopyIconSuccess}
            onError={handleCopyIconError}
            className={cn(
              pressable.default,
              'rounded-inner',
              'border-background',
              'flex items-center justify-center p-2',
            )}
            aria-label="Copy your address by clicking the icon"
          />
          <CopyButton
            label={copyText}
            copyValue={address ?? ''}
            onSuccess={handleCopyIconSuccess}
            onError={handleCopyIconError}
            className={cn(
              pressable.alternate,
              text.legal,
              'text-foreground',
              'border-background',
              'rounded-default',
              zIndex.dropdown,
              'absolute top-full right-0 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
            )}
            aria-label="Copy your address by clicking the tooltip"
          />
        </div>
      </div>
      <QrCodeSvg value={address} />
      <CopyButton
        copyValue={address ?? ''}
        label={copyButtonText}
        className={cn(
          'rounded-default',
          pressable.alternate,
          'w-full p-3',
          classNames?.copyButton,
        )}
        onSuccess={handleCopyButtonSuccess}
        onError={handleCopyButtonError}
        aria-label="Copy your address by clicking the button"
      />
    </div>
  );
}
