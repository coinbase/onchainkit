'use client';

import { PressableIcon } from '@/internal/components/PressableIcon';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { CloseSvg } from '@/internal/svg/closeSvg';
import { cn, text } from '@/styles/theme';
import { useCallback } from 'react';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { useSendContext } from './SendProvider';

type SendHeaderProps = {
  label?: string;
  classNames?: {
    container?: string;
    label?: string;
    close?: string;
    back?: string;
  };
};

export function SendHeader({ label = 'Send', classNames }: SendHeaderProps) {
  const { setShowSend } = useWalletAdvancedContext();

  const {
    selectedRecipientAddress,
    selectedToken,
    handleResetTokenSelection,
    handleRecipientInputChange,
  } = useSendContext();

  const handleBack = useCallback(() => {
    if (selectedToken) {
      handleResetTokenSelection();
    } else if (selectedRecipientAddress.value) {
      handleRecipientInputChange();
    }
  }, [
    selectedRecipientAddress,
    selectedToken,
    handleResetTokenSelection,
    handleRecipientInputChange,
  ]);

  const handleClose = useCallback(() => {
    setShowSend(false);
  }, [setShowSend]);

  return (
    <div
      className={cn(
        'mb-4 grid grid-cols-3 items-center',
        classNames?.container,
      )}
    >
      <div className="justify-self-start">
        {selectedRecipientAddress.value && (
          <PressableIcon
            onClick={handleBack}
            className={cn('h-7 w-7 scale-110 p-2', classNames?.back)}
          >
            {backArrowSvg}
          </PressableIcon>
        )}
      </div>
      <div
        className={cn(text.headline, 'justify-self-center', classNames?.label)}
      >
        {label}
      </div>
      <div className="justify-self-end">
        <PressableIcon
          onClick={handleClose}
          className={cn('h-7 w-7 scale-110 p-2', classNames?.close)}
        >
          <CloseSvg />
        </PressableIcon>
      </div>
    </div>
  );
}
