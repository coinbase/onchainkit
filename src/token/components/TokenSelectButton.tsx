import { type ForwardedRef, forwardRef } from 'react';
import type { TokenSelectButtonReact } from '../types';
import { TokenImage } from './TokenImage';
import { cn, pressable, text } from '../../styles/theme';

function CaretUp() {
  return (
    <svg
      data-testid="ockTokenSelectButton_CaretUp"
      role="img"
      aria-label="ock-caretup-icon"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.05329 10.9866L7.99996 6.03997L12.9466 10.9866L14.1266 9.80663L7.99996 3.67997L1.87329 9.80663L3.05329 10.9866Z"
        fill="#0A0B0D"
      />
    </svg>
  );
}

function CaretDown() {
  return (
    <svg
      data-testid="ockTokenSelectButton_CaretDown"
      role="img"
      aria-label="ock-caretdown-icon"
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.95 4.85999L8.00001 9.80999L3.05001 4.85999L1.64001 6.27999L8.00001 12.64L14.36 6.27999L12.95 4.85999Z"
        fill="#0A0B0D"
      />
    </svg>
  );
}

export const TokenSelectButton = forwardRef(function TokenSelectButton(
  { onClick, token, isOpen, className }: TokenSelectButtonReact,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      type="button"
      data-testid="ockTokenSelectButton_Button"
      className={cn(
        pressable.inverse,
        pressable.shadow,
        'flex w-fit items-center gap-2 rounded-lg px-3 py-1 outline-none',
        className,
      )}
      onClick={onClick}
      ref={ref}
    >
      {token ? (
        <>
          <div className="w-4">
            <TokenImage token={token} size={16} />
          </div>
          <span
            className={text.headline}
            data-testid="ockTokenSelectButton_Symbol"
          >
            {token.symbol}
          </span>
        </>
      ) : (
        <span className={text.headline}>Select token</span>
      )}
      <div className="relative flex items-center justify-center">
        <div className="absolute top-0 left-0 h-4 w-4" />
        {isOpen ? <CaretUp /> : <CaretDown />}
      </div>
    </button>
  );
});
