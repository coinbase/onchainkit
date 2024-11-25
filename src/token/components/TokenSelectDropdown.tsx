import { useCallback, useEffect, useRef, useState } from 'react';
import { background, border, cn } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import type { TokenSelectDropdownReact } from '../types';
import { TokenRow } from './TokenRow';
import { TokenSelectButton } from './TokenSelectButton';
import { FocusScope } from '../../internal/components/FocusScope';

export function TokenSelectDropdown({
  options,
  setToken,
  token,
}: TokenSelectDropdownReact) {
  const componentTheme = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const activeIndexRef = useRef(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) {
        return;
      }

      const currentIndex = activeIndexRef.current;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          activeIndexRef.current = Math.min(
            currentIndex + 1,
            options.length - 1,
          );
          const nextElement = document.querySelector<HTMLElement>(
            `[data-index="${activeIndexRef.current}"]`,
          );
          nextElement?.focus();
          break;
        }

        case 'ArrowUp': {
          e.preventDefault();
          activeIndexRef.current = Math.max(currentIndex - 1, 0);
          const prevElement = document.querySelector<HTMLElement>(
            `[data-index="${activeIndexRef.current}"]`,
          );
          prevElement?.focus();
          break;
        }

        case 'Home': {
          e.preventDefault();
          activeIndexRef.current = 0;
          document.querySelector<HTMLElement>('[data-index="0"]')?.focus();
          break;
        }

        case 'End': {
          e.preventDefault();
          activeIndexRef.current = options.length - 1;
          document
            .querySelector<HTMLElement>(`[data-index="${options.length - 1}"]`)
            ?.focus();
          break;
        }
      }
    },
    [isOpen, options.length],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative max-w-fit bg-yellow-300-400">
      <TokenSelectButton
        ref={buttonRef}
        onClick={handleToggle}
        isOpen={isOpen}
        token={token}
      />

      {isOpen && (
        <FocusScope contain={true} restoreFocus={true} autoFocus={true}>
          <div
            ref={dropdownRef}
            data-testid="ockTokenSelectDropdown_List"
            className={cn(
              componentTheme,
              border.radius,
              'absolute right-0 z-10 mt-1 flex max-h-80 w-[200px] flex-col overflow-y-hidden',
              'ock-scrollbar',
            )}
            role="listbox"
            aria-label="Select token"
          >
            <div className="overflow-y-auto bg-[#ffffff]">
              {options.map((option, index) => (
                <TokenRow
                  className={cn(background.inverse, 'px-4 py-2')}
                  key={option.name + option.address}
                  token={option}
                  onClick={() => {
                    setToken(option);
                    handleToggle();
                  }}
                  data-index={index}
                  // role="option"
                  // aria-selected={option.address === token?.address}
                  // tabIndex={0}
                />
              ))}
            </div>
          </div>
        </FocusScope>
      )}
    </div>
  );
}
