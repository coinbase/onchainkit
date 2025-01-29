import { PressableIcon } from '@/internal/components/PressableIcon';
import { backArrowSvg } from '@/internal/svg/backArrowSvg';
import { CloseSvg } from '@/internal/svg/closeSvg';
import { cn, text } from '@/styles/theme';
import { useCallback } from 'react';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { useSendContext } from './SendProvider';

export function SendHeader({ label = 'Send' }: { label?: string }) {
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
    } else if (selectedRecipientAddress) {
      handleRecipientInputChange(selectedRecipientAddress);
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
    <div className="mb-4 grid grid-cols-3 items-center">
      <div className="justify-self-start">
        {selectedRecipientAddress && (
          <PressableIcon onClick={handleBack} className="h-7 w-7 scale-110 p-2">
            {backArrowSvg}
          </PressableIcon>
        )}
      </div>
      <div className={cn(text.headline, 'justify-self-center')}>{label}</div>
      <div className="justify-self-end">
        <PressableIcon onClick={handleClose} className="h-7 w-7 scale-110 p-2">
          <CloseSvg />
        </PressableIcon>
      </div>
    </div>
  );
}
