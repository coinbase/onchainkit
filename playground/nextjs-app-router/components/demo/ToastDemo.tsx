import { useContext } from 'react';
import { useAccount } from 'wagmi';
import { AppContext } from '@/components/AppProvider';
import { successSvg } from '@/onchainkit/src/internal/svg/successSvg';
import { Toast } from '@/onchainkit/src/global/components/Toast';
import { getChainExplorer } from '@/onchainkit/src/network/getChainExplorer';
import { cn, color, text } from '@/onchainkit/src/styles/theme';

export default function ToastDemo() {
  const {
    toastPosition,
    isToastVisible,
    setIsToastVisible,
    toastDurationMs,
    toastTransactionHash,
  } = useContext(AppContext);

  const { chainId } = useAccount();
  const chainExplorer = getChainExplorer(chainId);
  const txHash = '0x1234567890abcdef';

  return (
    <Toast
      position={toastPosition ?? 'bottom-center'}
      isToastVisible={isToastVisible ?? true}
      setIsToastVisible={setIsToastVisible}
      closeToast={() => setIsToastVisible(false)}
      durationMs={toastDurationMs ?? 3000}
    >
      <div className={cn(text.label2)}>{successSvg}</div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <p className={color.foreground}>Successful</p>
      </div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <a
          href={`${chainExplorer}/tx/${toastTransactionHash ?? txHash}`}
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
