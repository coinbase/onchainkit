import { useCallback, useEffect, useRef, useState } from 'react';
import type { TokenSelectDropdownReact } from '../types';
import { TokenRow } from './TokenRow';
import { TokenSelectButton } from './TokenSelectButton';
import { cn } from '../../styles/theme';

export function TokenSelectDropdown({
  options,
  setToken,
  token,
}: TokenSelectDropdownReact) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* istanbul ignore next */
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
    <div className="relative shrink-0">
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
            'absolute z-10 mt-1 flex max-h-80 w-[250px] flex-col overflow-y-hidden rounded-lg',
            'ock-scrollbar',
          )}
        >
          <div className="overflow-y-auto bg-[#ffffff]">
            {options.map((token) => (
              <TokenRow
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
