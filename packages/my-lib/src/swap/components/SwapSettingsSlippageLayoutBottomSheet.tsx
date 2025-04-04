import { background, border, cn, color, pressable } from '../../styles/theme';
import type { SwapSettingsSlippageLayoutReact } from '../types';

export function SwapSettingsSlippageLayoutBottomSheet({
  children,
  className,
}: SwapSettingsSlippageLayoutReact) {
  return (
    <div
      className={cn(
        background.default,
        border.default,
        pressable.shadow,
        'right-0 z-10 h-full w-full rounded-t-lg px-3 pt-2 pb-3',
        className,
      )}
      data-testid="ockSwapSettingsLayout_container"
    >
      <div
        className={cn(
          background.alternate,
          'mx-auto mb-2 h-1 w-4 rounded-[6.25rem]',
        )}
      />
      <div className="mb-4 flex items-center justify-center">
        <h2 className={cn(color.foreground, 'font-bold text-sm')}>Settings</h2>
      </div>

      <div className="flex flex-col">{children}</div>
      <div className="mt-4 flex justify-center">
        <div
          className={cn(
            background.inverse,
            'h-1 w-28 shrink-0 rounded-[0.43931rem]',
          )}
        />
      </div>
    </div>
  );
}
