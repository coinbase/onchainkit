import { useCallback, useEffect, useRef, useState } from 'react';
import type { Token, TokenSelectModalReact } from '../types';
import { TokenSelectButton } from './TokenSelectButton';
import { TokenSearch } from './TokenSearch';
import { TokenChip } from './TokenChip';
import { TokenRow } from './TokenRow';
import { background, cn } from '../../styles/theme';

type TokenSelectModalInnerReact = {
  setToken: (t: Token) => void;
  closeModal: () => void;
  options: Token[];
};

function TokenSelectModalInner({
  setToken,
  closeModal,
  options,
}: TokenSelectModalInnerReact) {
  const [originalOverflowY] = useState(document.body.style.overflowY);
  const [filteredTokens, setFilteredTokens] = useState(options);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBlur = useCallback(
    (event: MouseEvent) => {
      const isOutsideModal =
        modalRef.current && !modalRef.current.contains(event.target as Node);

      if (isOutsideModal) {
        closeModal();
      }
    },
    [closeModal],
  );

  const handleClick = useCallback(
    (token: Token) => {
      setToken(token);
      closeModal();
    },
    [setToken, closeModal],
  );

  const handleChange = useCallback(
    (text: string) => {
      setFilteredTokens(
        options.filter(({ address, name, symbol }) => {
          return (
            address.toLowerCase().startsWith(text) ||
            name.toLowerCase().includes(text) ||
            symbol.toLowerCase().includes(text)
          );
        }),
      );
    },
    [options],
  );

  useEffect(() => {
    document.body.style.overflowY = 'hidden';
    // NOTE: this ensures that handleBlur doesn't get called on initial mount
    //       We need to use non-div elements to properly handle onblur events
    setTimeout(() => {
      document.addEventListener('click', handleBlur);
    }, 0);

    return () => {
      document.body.style.overflowY = originalOverflowY;
      document.removeEventListener('click', handleBlur);
    };
  }, [handleBlur, originalOverflowY]);

  return (
    <div
      className={cn(
        'absolute left-0 z-50 flex h-full w-full items-center justify-center',
      )}
      style={{
        top: window.scrollY,
        background: 'rgba(226, 232, 240, 0.5)',
      }}
    >
      <div
        ref={modalRef}
        className={cn(
          background.default,
          'flex w-[475px] flex-col gap-4 rounded-3xl p-4',
        )}
      >
        <TokenSearch onChange={handleChange} delayMs={0} />
        {filteredTokens.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filteredTokens.slice(0, 4).map((token) => (
              <TokenChip
                key={token.name}
                className="shadow-none"
                token={token}
                onClick={handleClick}
              />
            ))}
          </div>
        )}
        {filteredTokens.length > 0 ? (
          <div>
            <div className="text-black text-body">Tokens</div>
            <div
              className="ock-scrollbar overflow-y-auto"
              style={{ minHeight: '300px', height: '300px' }}
            >
              {filteredTokens.map((token, idx) => (
                <TokenRow
                  key={`${token.name}${idx}`}
                  token={token}
                  onClick={handleClick}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-black text-body">No tokens found</div>
        )}
      </div>
    </div>
  );
}

export function TokenSelectModal({
  options,
  setToken,
  token,
}: TokenSelectModalReact) {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleToggle = useCallback(() => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  }, [isOpen, closeModal, openModal]);

  return (
    <>
      <TokenSelectButton onClick={handleToggle} isOpen={isOpen} token={token} />
      {isOpen && (
        <TokenSelectModalInner
          options={options}
          setToken={setToken}
          closeModal={closeModal}
        />
      )}
    </>
  );
}
