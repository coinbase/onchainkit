'use client';
import { useCallback } from 'react';
import { cn, color, text } from '../../styles/theme';

import { useAccount } from 'wagmi';
import { getChainExplorer } from '../../core/network/getChainExplorer';
import { Toast } from '../../internal/components/Toast';
import { SuccessSvg } from '../../internal/svg/successSvg';
import type { SwapToastReact } from '../types';
import { useSwapContext } from './SwapProvider';

export function SwapToast({
  className,
  durationMs = 5000,
  position = 'bottom-center',
}: SwapToastReact) {
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

  if (!isToastVisible) {
    return null;
  }

  return (
    <Toast
      position={position}
      className={className}
      durationMs={durationMs}
      isVisible={isToastVisible}
      onClose={resetToastState}
    >
      <div className={cn(text.label2)}>
        <SuccessSvg />
      </div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <p className={color.foreground}>Successful</p>
      </div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <a
          href={`${chainExplorer}/tx/${transactionHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <span className={cn(text.label1, color.primary)}>
            View transaction
          </span>
        </a>
      </div>
    </Toast>
  );
}
