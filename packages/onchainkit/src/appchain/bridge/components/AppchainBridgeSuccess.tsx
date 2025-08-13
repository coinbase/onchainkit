'use client';
import { SuccessSvg } from '@/internal/svg/fullWidthSuccessSvg';
import { cn, pressable, text } from '@/styles/theme';
import type { AppchainBridgeSuccessProps } from '../types';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';

export const AppchainBridgeSuccess = ({
  title = 'Success!',
  primaryButtonLabel = 'View Transaction',
  secondaryButtonLabel = 'Back to bridge',
}: AppchainBridgeSuccessProps) => {
  const { handleOpenExplorer, handleResetState } = useAppchainBridgeContext();

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
                <SuccessSvg className="fill-ock-primary" />
              </div>
            </div>
            <div className="text-ock-foreground flex-1 text-center font-medium text-sm">
              {title}
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            {[
              {
                label: primaryButtonLabel,
                action: handleOpenExplorer,
                variant: 'primary',
                textColor: 'text-ock-foreground-inverse',
              },
              {
                label: secondaryButtonLabel,
                action: handleResetState,
                variant: 'secondary',
                textColor: 'text-ock-foreground',
              },
            ].map(({ label, action, variant, textColor }) => (
              <button
                key={label}
                className={cn(
                  pressable[variant as keyof typeof pressable],
                  'rounded-ock-default',
                  'w-full rounded-xl',
                  'px-4 py-3 text-base text-white leading-6',
                  text.label1,
                )}
                type="button"
                onClick={action}
              >
                <div
                  className={cn(
                    text.headline,
                    textColor,
                    'flex justify-center',
                  )}
                >
                  {label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
