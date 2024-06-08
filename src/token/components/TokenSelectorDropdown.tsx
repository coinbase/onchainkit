import { useCallback, useEffect, useRef } from 'react';
import type { TokenSelectorDropdownReact } from '../types';
import { TokenRow } from './TokenRow';

export function TokenSelectorDropdown({ setToken, options, onToggle }: TokenSelectorDropdownReact) {
  const ref = useRef<HTMLDivElement>(null);

  const handleBlur = useCallback((event: MouseEvent) => {
    /* istanbul ignore next */
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onToggle();
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
  }, []);

  return (
    <div ref={ref} className="ock-tokenselectordropdown-container">
      <div className="ock-tokenselectordropdown-scroll">
        {options.map((token) => (
          <TokenRow
            key={token.name + token.address}
            token={token}
            onClick={() => {
              setToken(token);
              onToggle();
            }}
          />
        ))}
      </div>
    </div>
  );
}
