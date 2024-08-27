import { useCallback, useEffect, useRef, useState } from 'react';
import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { cn } from '../../styles/theme';
import { useIcon } from '../../wallet/hooks/useIcon';
import type { SwapSettingsReact } from '../types';
import { SlippageLayout } from './SlippageLayout';

export function SwapSettings({
  children,
  className,
  icon = 'swapSettings',
  text = '',
}: SwapSettingsReact) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const childrenArray = useMemo(() => {
    return Children.toArray(children).map((child) => {
      if (isValidElement(child)) {
        // @ts-ignore
        return cloneElement(child);
      }
      return child;
    });
  }, [children]);

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
      <span className="font-sans text-base leading-normal">{text}</span>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          aria-label="Toggle swap settings"
          className="rounded-full p-2 opacity-50 transition-opacity hover:opacity-100"
          onClick={handleToggle}
        >
          {iconSvg}
        </button>
        {isOpen && (
          <div
            className={cn(
              'absolute right-0 z-10 mt-1 w-[21.75rem] rounded-lg border border-gray-300 bg-gray-50 shadow-lg dark:border-gray-700 dark:bg-gray-950',
            )}
            data-testid="ockSwapSettingsDropdown"
          >
            {/* {childrenArray} */}
            <SlippageLayout>{childrenArray}</SlippageLayout>
          </div>
        )}
      </div>
    </div>
  );
}
