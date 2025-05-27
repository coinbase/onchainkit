'use client';

import { PressableIcon } from '@/internal/components/PressableIcon';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { CloseSvg } from '@/internal/svg/closeSvg';
import { cn, text } from '@/styles/theme';
import { useCallback } from 'react';
import { useWalletContext } from '../../WalletProvider';
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
  const { setActiveFeature } = useWalletContext();

  const {
    recipientState,
    selectedToken,
    handleResetTokenSelection,
    deselectRecipient,
  } = useSendContext();

  const handleBack = useCallback(() => {
    if (selectedToken) {
      handleResetTokenSelection();
    } else if (recipientState.address) {
      deselectRecipient();
    }
  }, [
    recipientState.address,
    selectedToken,
    handleResetTokenSelection,
    deselectRecipient,
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
        {recipientState.phase === 'selected' && (
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
