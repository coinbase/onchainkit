import { cn, text } from '@/styles/theme';
import { useWalletAdvancedContext } from '../../WalletAdvancedProvider';
import { useCallback, type ReactNode } from 'react';
import { PressableIcon } from '@/internal/components/PressableIcon';
import { CloseSvg } from '@/internal/svg/closeSvg';

export function SendHeader({
  label = 'Send',
  leftContent,
}: {
  label?: string;
  leftContent?: ReactNode;
}) {
  const { setShowSend } = useWalletAdvancedContext();

  const handleClose = useCallback(() => {
    setShowSend(false);
  }, [setShowSend]);

  return (
    <div className="mb-4 grid grid-cols-3 items-center">
      <div className="justify-self-start">{leftContent}</div>
      <div className={cn(text.headline, 'justify-self-center')}>{label}</div>
      <div className="justify-self-end">
        <PressableIcon onClick={handleClose} className="h-7 w-7 scale-110 p-2">
          <CloseSvg />
        </PressableIcon>
      </div>
    </div>
  );
}
