'use client';

import { PressableIcon } from '@/internal/components/PressableIcon';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { CloseSvg } from '@/internal/svg/closeSvg';
import { cn, text } from '@/styles/theme';
import { useCallback } from 'react';
import { useSendContext } from './SendProvider';
import { useWalletContext } from '../../WalletProvider';

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
  const { setActiveFeature } = useWalletContext();

  const {
    selectedRecipient,
    selectedToken,
    handleResetTokenSelection,
    handleRecipientInputChange,
  } = useSendContext();

  const handleBack = useCallback(() => {
    if (selectedToken) {
      handleResetTokenSelection();
    } else if (selectedRecipient.address) {
      handleRecipientInputChange();
    }
  }, [
    selectedRecipient,
    selectedToken,
    handleResetTokenSelection,
    handleRecipientInputChange,
  ]);

  const handleClose = useCallback(() => {
    setActiveFeature(null);
  }, [setActiveFeature]);

  return (
    <div
      data-testid="ockSendHeader"
      className={cn(
        'mb-4 grid grid-cols-3 items-center',
        classNames?.container,
      )}
    >
      <div data-testid="ockSendHeader_back" className="justify-self-start">
        {selectedRecipient.address && (
          <PressableIcon
            onClick={handleBack}
            className={cn('h-7 w-7 scale-110 p-2', classNames?.back)}
          >
            {backArrowSvg}
          </PressableIcon>
        )}
      </div>
      <div
        data-testid="ockSendHeader_label"
        className={cn(text.headline, 'justify-self-center', classNames?.label)}
      >
        {label}
      </div>
      <div data-testid="ockSendHeader_close" className="justify-self-end">
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
