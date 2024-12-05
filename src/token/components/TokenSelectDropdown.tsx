import { useCallback, useEffect, useRef, useState } from 'react';
import { background, border, cn } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import type { TokenSelectDropdownReact } from '../types';
import { TokenRow } from './TokenRow';
import { TokenSelectButton } from './TokenSelectButton';

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

  /* v8 ignore next 11 */
  const handleBlur = useCallback((event: MouseEvent) => {
    const isOutsideDropdown =
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node);
    const isOutsideButton =
      buttonRef.current && !buttonRef.current.contains(event.target as Node);

    if (isOutsideDropdown && isOutsideButton) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    // NOTE: this ensures that handleBlur doesn't get called on initial mount
    //       We need to use non-div elements to properly handle onblur events
    setTimeout(() => {
      document.addEventListener('click', handleBlur);
    }, 0);

    return () => {
      document.removeEventListener('click', handleBlur);
    };
  }, [handleBlur]);

  return (
    <div className="relative max-w-fit shrink-0">
      <TokenSelectButton
        ref={buttonRef}
        onClick={handleToggle}
        isOpen={isOpen}
        token={token}
      />
      {isOpen && (
        <div
          ref={dropdownRef}
          data-testid="ockTokenSelectDropdown_List"
          className={cn(
            componentTheme,
            border.radius,
            'absolute right-0 z-10 mt-1 flex max-h-80 w-[200px] flex-col overflow-y-hidden',
            'ock-scrollbar',
          )}
        >
          <div className="overflow-y-auto bg-[#ffffff]">
            {options.map((token) => (
              <TokenRow
                className={cn(background.inverse, 'px-4 py-2')}
                key={token.name + token.address}
                token={token}
                onClick={() => {
                  setToken(token);
                  handleToggle();
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
