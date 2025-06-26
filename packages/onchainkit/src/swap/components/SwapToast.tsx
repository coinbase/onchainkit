'use client';
import { useCallback } from 'react';
import { cn, text } from '@/styles/theme';

import { useAccount } from 'wagmi';
import { getChainExplorer } from '@/core/network/getChainExplorer';
import { Toast } from '@/internal/components/Toast';
import { SuccessSvg } from '@/internal/svg/successSvg';
import type { SwapToastProps } from '../types';
import { useSwapContext } from './SwapProvider';

export function SwapToast({
  className,
  duration = 5000,
  position = 'bottom-center',
  render,
}: SwapToastProps) {
  const {
    isToastVisible,
    setIsToastVisible,
    setTransactionHash,
    transactionHash,
  } = useSwapContext();

  const { chainId } = useAccount();
  const chainExplorer = getChainExplorer(chainId);

  const resetToastState = useCallback(() => {
    setIsToastVisible(false);
    setTransactionHash('');
  }, [setIsToastVisible, setTransactionHash]);

  if (render) {
    return render({
      isToastVisible,
      transactionHash,
      resetToastState,
      chainExplorer,
    });
  }

  if (!isToastVisible) {
    return null;
  }

  return (
    <Toast
      position={position}
      className={className}
      duration={duration}
      open={isToastVisible}
      onClose={resetToastState}
    >
      <div className={cn(text.label2)}>
        <SuccessSvg />
      </div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <p className={'text-ock-foreground'}>Successful</p>
      </div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <a
          href={`${chainExplorer}/tx/${transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className={cn(text.label1, 'text-ock-primary')}>
            View transaction
          </span>
        </a>
      </div>
    </Toast>
  );
}
