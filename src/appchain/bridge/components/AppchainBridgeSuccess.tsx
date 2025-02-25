import { SuccessSvg } from '@/internal/svg/fullWidthSuccessSvg';
import { border, cn, color, pressable, text } from '@/styles/theme';
import type { AppchainBridgeSuccessReact } from '../types';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

export const AppchainBridgeSuccess = ({
  title = 'Success!',
  primaryButtonLabel = 'View Transaction',
  secondaryButtonLabel = 'Back to bridge',
}: AppchainBridgeSuccessReact) => {
  const { handleOpenExplorer, setIsSuccessModalOpen } =
    useAppchainBridgeContext();

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div>
        <div className="flex items-center" />
      </div>
      <div className="mt-16 px-4">
        <div className="flex flex-col items-center gap-16">
          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="flex justify-center">
              <div className="h-12 w-12">
                <SuccessSvg fill="var(--ock-bg-primary)" />
              </div>
            </div>
            <div className="ock-text-foreground flex-1 text-center font-medium text-sm">
              {title}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <button
              className={cn(
                pressable.primary,
                border.radius,
                'w-full rounded-xl',
                'px-4 py-3 text-base text-white leading-6',
                text.label1,
              )}
              type="button"
              onClick={handleOpenExplorer}
            >
              <div
                className={cn(
                  text.headline,
                  color.inverse,
                  'flex justify-center',
                )}
              >
                {primaryButtonLabel}
              </div>
            </button>
            <button
              className={cn(
                pressable.secondary,
                border.radius,
                'w-full rounded-xl',
                'px-4 py-3 text-base text-white leading-6',
                text.label1,
              )}
              type="button"
              onClick={() => {
                setIsSuccessModalOpen(false);
              }}
            >
              <div
                className={cn(
                  text.headline,
                  color.foreground,
                  'flex justify-center',
                )}
              >
                {secondaryButtonLabel}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
