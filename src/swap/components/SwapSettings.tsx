import { useCallback, useRef, useState } from 'react';
import { useIcon } from '../../internal/hooks/useIcon';
import { background, border, cn, pressable, text } from '../../styles/theme';
import { useBreakpoints } from '../../useBreakpoints';
import { useOutsideClick } from '../../useOutsideClick';
import type { SwapSettingsReact } from '../types';
import { SwapSettingsSlippageLayout } from './SwapSettingsSlippageLayout';
import { SwapSettingsSlippageLayoutBottomSheet } from './SwapSettingsSlippageLayoutBottomSheet';

export function SwapSettings({
  children,
  className,
  icon = 'swapSettings',
  text: buttonText = '',
}: SwapSettingsReact) {
  const breakpoint = useBreakpoints();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  });

  const iconSvg = useIcon({ icon });

  return (
    <div
      className={cn(
        'flex w-full items-center justify-end space-x-1',
        className,
      )}
      data-testid="ockSwapSettings_Settings"
    >
      {buttonText && <span className={cn(text.body)}>{buttonText}</span>}
      <div className={cn('relative', isOpen && 'group')} ref={dropdownRef}>
        <button
          type="button"
          aria-label="Toggle swap settings"
          className={cn(
            pressable.default,
            'rounded-full p-2 opacity-50 transition-opacity hover:opacity-100',
          )}
          onClick={handleToggle}
        >
          <div className="h-[1.125rem] w-[1.125rem]">{iconSvg}</div>
        </button>
        {breakpoint === 'sm' ? (
          <div
            className={cn(
              background.inverse,
              pressable.shadow,
              'fixed inset-x-0 z-50 transition-[bottom] duration-300 ease-in-out',
              '-bottom-[12.875rem] h-[12.875rem] rounded-t-lg group-[]:bottom-0',
              className,
            )}
            data-testid="ockSwapSettingsSlippageLayoutBottomSheet_container"
          >
            <SwapSettingsSlippageLayoutBottomSheet className={className}>
              {children}
            </SwapSettingsSlippageLayoutBottomSheet>
          </div>
        ) : (
          isOpen && (
            <div
              className={cn(
                border.radius,
                background.default,
                pressable.shadow,
                'absolute right-0 z-10 mt-1 w-[21.75rem] rounded-lg',
              )}
              data-testid="ockSwapSettingsDropdown"
            >
              <SwapSettingsSlippageLayout>
                {children}
              </SwapSettingsSlippageLayout>
            </div>
          )
        )}
      </div>
    </div>
  );
}
