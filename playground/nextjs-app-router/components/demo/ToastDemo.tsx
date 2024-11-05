import { useContext, useState } from 'react';
import { useAccount } from 'wagmi';
import { Toast } from '@/onchainkit/src/global/components/Toast';
import { successSvg } from '@/onchainkit/src/internal/svg/successSvg';
import { cn, color, text } from '@/onchainkit/src/styles/theme';
import { getChainExplorer } from '@/onchainkit/src/network/getChainExplorer';
import { AppContext } from '@/components/AppProvider';

export default function ToastDemo() {
  const [isToastVisible, setIsToastVisible] = useState<boolean>(true);

  const { chainId } = useAccount();
  const chainExplorer = getChainExplorer(chainId);
  const txHash = '0x1234567890abcdef';

  const { componentTheme } = useContext(AppContext);

  return (
    <Toast
      position="top-center"
      isToastVisible={isToastVisible}
      closeToast={() => setIsToastVisible((prev) => !prev)}
      transactionHash="0x1234567890abcdef"
    >
      <div className={cn(text.label2)}>{successSvg}</div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <p className={color.foreground}>Successful</p>
      </div>
      <div className={cn(text.label1, 'text-nowrap')}>
        <a
          href={`${chainExplorer}/tx/${txHash}`}
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
