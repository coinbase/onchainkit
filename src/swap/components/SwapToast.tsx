import { useEffect } from 'react';
import { cn, color, text } from '../../styles/theme';

import { useAccount } from 'wagmi';
import { successSvg } from '../../internal/svg/successSvg';
import { getChainExplorer } from '../../network/getChainExplorer';
import type { SwapToastReact } from '../types';
import { useSwapContext } from './SwapProvider';
import { Toast } from '../../internal/components/Toast';

export function SwapToast({
  className,
  durationMs = 3000,
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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isToastVisible) {
        setIsToastVisible?.(false);
        setTransactionHash?.('');
      }
    }, durationMs);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [durationMs, isToastVisible, setIsToastVisible, setTransactionHash]);

  if (!isToastVisible) {
    return null;
  }

  return (
    <Toast
      position={position}
      className={className}
      durationMs={durationMs}
      isToastVisible={isToastVisible}
      setIsToastVisible={setIsToastVisible}
    >
      <div className={cn(text.label2)}>{successSvg}</div>
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
