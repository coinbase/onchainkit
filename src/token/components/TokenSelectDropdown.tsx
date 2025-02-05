'use client';

import { useCallback, useRef, useState } from 'react';
import { DropdownMenu } from '../../internal/components/DropdownMenu';
import { background, border, cn, color } from '../../styles/theme';
import type { TokenSelectDropdownReact } from '../types';
import { TokenRow } from './TokenRow';
import { TokenSelectButton } from './TokenSelectButton';

export function TokenSelectDropdown({
  options,
  setToken,
  token,
}: TokenSelectDropdownReact) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative max-w-fit shrink-0">
      <TokenSelectButton
        ref={buttonRef}
        onClick={toggleDropdown}
        isOpen={isOpen}
        token={token}
      />
      <DropdownMenu
        trigger={buttonRef}
        isOpen={isOpen}
        onClose={closeDropdown}
        align="end"
      >
        <div
          data-testid="ockTokenSelectDropdown_List"
          className={cn(
            border.radius,
            color.foreground,
            'flex max-h-80 w-[200px] flex-col overflow-y-hidden',
            'ock-scrollbar',
          )}
        >
          <div className="overflow-y-auto">
            {options.map((token) => (
              <TokenRow
                className={cn(background.inverse, 'px-4 py-2')}
                key={token.name + token.address}
                token={token}
                onClick={() => {
                  setToken(token);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      </DropdownMenu>
    </div>
  );
}
