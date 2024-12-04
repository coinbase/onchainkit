import { useCallback, useEffect, useRef, useState } from 'react';
import { closeSvg } from '../../internal/svg/closeSvg';
import {
  background,
  border,
  cn,
  color,
  text,
} from '../../styles/theme';
import { useOnchainKit } from '../../useOnchainKit';
import { Token, TokenChip, TokenRow, TokenSearch } from '..';
import { getTokens } from '../../api/getTokens';

type TokenPickerProps = {
  pickedToken: Token;
  onTokenPicked: (token: Token) => void;
  defaultTokens?: Token[];
  className?: string;
  onError?: (error: Error) => void;
};

export function TokenPicker({
  pickedToken,
  onTokenPicked,
  defaultTokens,
  className,
  onError,
}: TokenPickerProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const tokenListRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { config } = useOnchainKit();
  const [tokenOptions, setTokenOptions] = useState<Token[]>(defaultTokens || []);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const handleChange = useCallback((q: string) => {
    async function getData(q: string) {
      try {
        const tokens = await getTokens({ search: q }); 
        if (tokens instanceof Array) {
          setTokenOptions(tokens);
          setFocusedIndex(-1);
        }
      } catch (error) {
        onError?.(error as Error);
      }
    }
    void getData(q)
  }, []);

  const onClose = useCallback(() => {
    setIsOpen(false);
    handleChange('');
    setFocusedIndex(-1);
  }, []);

  const handleSelectToken = useCallback((token: Token) => {
    onTokenPicked(token);
    onClose();
  }, [onTokenPicked]);


  // Handle focus trap and keyboard interactions
  useEffect(() => {
    if (!isOpen || !modalRef.current) {
      return;
    }

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Tab') {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        } else if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < tokenOptions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        handleSelectToken(tokenOptions[focusedIndex]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, focusedIndex, tokenOptions, handleSelectToken]);

  // Handle scrolling focused item into view. useful if scrolling with arrow keys
  useEffect(() => {
    if (focusedIndex >= 0 && tokenListRef.current) {
      const tokenElements = tokenListRef.current.children;
      const focusedElement = tokenElements[focusedIndex] as HTMLElement;
      if (focusedElement) {
        focusedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [focusedIndex]);

  if (!isOpen) {
    return (
      <TokenChip 
        onClick={() => setIsOpen(true)}
        token={pickedToken}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/70 transition-opacity duration-200',
        isOpen ? 'opacity-100' : 'opacity-0',
      )}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Enter' && onClose()}
      role="presentation"
      data-testid="ockModalOverlay"
    >
      <div
        ref={modalRef}
        className={cn(
          border.lineDefault,
          border.radius,
          background.default,
          'w-[323px] p-6 pb-4',
          'flex flex-col gap-4',
          'relative',
          '-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2',
          'transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Enter' && e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'absolute top-4 right-4',
            'flex items-center justify-center',
            'h-3 w-3',
          )}
          aria-label="Close modal"
        >
          <div
            className={cn(
              'relative h-full w-full transition-colors',
              '[&>svg>path]:hover:fill-[var(--ock-icon-color-foreground-muted)]',
            )}
          >
            {closeSvg}
          </div>
        </button>

        {(config?.appearance?.logo || config?.appearance?.name) && (
          <div className="mt-3 flex w-[275px] flex-col items-center gap-3 self-stretch p-2">
            {config?.appearance?.logo && (
              <div className={cn(border.radius, 'h-14 w-14 overflow-hidden')}>
                <img
                  src={config?.appearance?.logo}
                  alt={`${config?.appearance?.name || 'App'} icon`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {config?.appearance?.name && (
              <h2 className={cn(text.headline, color.foreground)}>{config?.appearance?.name}</h2>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 bg-base-100">
          <h3 className="text-lg font-bold">Select a token</h3>
          <TokenSearch onChange={handleChange} delayMs={200} />
          <div className="flex justify-between items-center gap-2 overflow-x-auto w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {defaultTokens?.map((token) => (
              <div 
                data-testid={`ockTokenChip_${token.address}`}
                key={token.address}
              >
                <TokenChip 
                  token={token} 
                  onClick={handleSelectToken} 
                  className="shadow-none"
                />
              </div>
            ))}
          </div>
          <div 
            ref={tokenListRef}
            className="flex flex-col gap-2 mt-4 overflow-y-auto max-h-96 min-h-80"
          >
            {tokenOptions.map((token, index) => (
              <TokenRow 
                key={token.address}
                onClick={handleSelectToken}
                token={token} 
                className={cn(
                  index === focusedIndex ? 'border-2' : 'border-2 border-transparent'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}