import { useCallback, useEffect, useRef, useState } from 'react';
import type { Token, TokenSelectModalReact } from '../types';
import { TokenSelectButton } from './TokenSelectButton';
import { TokenSearch } from './TokenSearch';
import { TokenChip } from './TokenChip';
import { TokenRow } from './TokenRow';
import { background, cn, text } from '../../styles/theme';

type TokenSelectModalInnerReact = {
  setToken: (t: Token) => void;
  closeModal: () => void;
  options: Token[];
};

/* istanbul ignore next */
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
      data-testid="ockTokenSelectModal_Inner"
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
          'flex w-[475px] flex-col gap-3 rounded-3xl p-6',
        )}
      >
        <div className="flex items-center justify-between">
          <span className={text.title3}>Select a token</span>
          <button
            data-testid="TokenSelectModal_CloseButton"
            type="button"
            onClick={closeModal}
          >
            <svg
              role="img"
              aria-label="ock-close-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.3352 1L1 2.33521L6.66479 8L1 13.6648L2.3352 15L8 9.33521L13.6648 15L15 13.6648L9.33521 8L15 2.33521L13.6648 1L8 6.6648L2.3352 1Z"
                fill="#0A0B0D"
              />
            </svg>
          </button>
        </div>
        <TokenSearch onChange={handleChange} delayMs={0} />
        {filteredTokens.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filteredTokens.slice(0, 4).map((token, idx) => (
              <TokenChip
                key={`${token.name}${idx}`}
                className="shadow-none"
                token={token}
                onClick={handleClick}
              />
            ))}
          </div>
        )}
        {filteredTokens.length > 0 ? (
          <div className="mt-3">
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
          <div className="text-black text-body" style={{ minHeight: '368px' }}>
            No tokens found
          </div>
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
