import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../styles/theme';
import { useBreakpoints } from '../../useBreakpoints';
import { useIcon } from '../../wallet/hooks/useIcon';
import type { SwapSettingsReact } from '../types';
import { SwapSettingsSlippageLayout } from './SwapSettingsSlippageLayout';
import { SwapSettingsSlippageLayoutBottomSheet } from './SwapSettingsSlippageLayoutBottomSheet';

export function SwapSettings({
  children,
  className,
  icon = 'swapSettings',
  text = '',
}: SwapSettingsReact) {
  const breakpoint = useBreakpoints();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleClickOutsideComponent = useCallback((event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideComponent);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideComponent);
    };
  }, [handleClickOutsideComponent]);

  const iconSvg = useIcon({ icon });

  return (
    <div
      className={cn(
        'flex w-full items-center justify-end space-x-1',
        className,
      )}
      data-testid="ockSwapSettings_Settings"
    >
      {text && (
        <span className="font-sans text-base leading-normal">{text}</span>
      )}
      <div className={cn('relative', isOpen && 'group')} ref={dropdownRef}>
        <button
          type="button"
          aria-label="Toggle swap settings"
          className="rounded-full p-2 opacity-50 transition-opacity hover:opacity-100"
          onClick={handleToggle}
        >
          {iconSvg}
        </button>
        {breakpoint === 'sm' ? (
          <div
            className={cn(
              'fixed inset-x-0 z-50',
              'transition-[bottom] duration-300 ease-in-out',
              'h-[12.875rem] rounded-t-lg bg-gray-800 shadow-lg',
              '-bottom-[12.875rem] group-[]:bottom-0',
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
                'absolute right-0 z-10 mt-1 w-[21.75rem] rounded-lg border border-gray-300',
                'bg-gray-50 shadow-lg dark:border-gray-700 dark:bg-gray-950',
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
