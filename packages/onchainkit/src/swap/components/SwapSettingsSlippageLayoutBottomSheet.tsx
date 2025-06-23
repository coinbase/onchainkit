import { cn } from '@/styles/theme';
import type { SwapSettingsSlippageLayoutProps } from '../types';

export function SwapSettingsSlippageLayoutBottomSheet({
  children,
  className,
}: SwapSettingsSlippageLayoutProps) {
  return (
    <div
      className={cn(
        'bg-background',
        'border-background',
        'shadow-default',
        'right-0 z-10 h-full w-full rounded-t-lg px-3 pt-2 pb-3',
        className,
      )}
      data-testid="ockSwapSettingsLayout_container"
    >
      <div
        className={cn(
          'bg-background-alternate',
          'mx-auto mb-2 h-1 w-4 rounded-[6.25rem]',
        )}
      />
      <div className="mb-4 flex items-center justify-center">
        <h2 className={cn('text-foreground', 'font-bold text-sm')}>Settings</h2>
      </div>

      <div className="flex flex-col">{children}</div>
      <div className="mt-4 flex justify-center">
        <div
          className={cn(
            'bg-background-inverse',
            'h-1 w-28 shrink-0 rounded-[0.43931rem]',
          )}
        />
      </div>
    </div>
  );
}
