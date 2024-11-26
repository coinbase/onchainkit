import { useCallback, useRef, useState } from 'react';
import { background, border, cn } from '../../styles/theme';
import { useTheme } from '../../useTheme';
import type { TokenSelectDropdownReact } from '../types';
import { TokenRow } from './TokenRow';
import { TokenSelectButton } from './TokenSelectButton';
import { FocusScope } from '../../internal/components/FocusScope';
import { DismissableLayer } from '../../internal/components/DismissableLayer';

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

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <FocusScope trapped={isOpen} loop={true} listbox={true}>
      <div className="relative max-w-fit shrink-0">
        <TokenSelectButton
          ref={buttonRef}
          onClick={handleToggle}
          isOpen={isOpen}
          token={token}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {isOpen && (
          <DismissableLayer
            onDismiss={() => setIsOpen(false)}
            onEscapeKeyDown={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            buttonRef={buttonRef}
          >
            <div
              role="listbox"
              aria-label="Select token"
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
          </DismissableLayer>
        )}
      </div>
    </FocusScope>
  );
}
