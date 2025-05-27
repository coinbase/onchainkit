import { ForwardedRef, forwardRef } from 'react';
import { caretDownSvg } from '../../internal/svg/caretDownSvg';
import { caretUpSvg } from '../../internal/svg/caretUpSvg';
import { border, cn, pressable, text } from '../../styles/theme';
import type { TokenSelectButtonProps } from '../types';
import { TokenImage } from './TokenImage';

export const TokenSelectButton = forwardRef(
  (
    { onClick, token, isOpen, className }: TokenSelectButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
  ) => {
    return (
      <button
        type="button"
        data-testid="ockTokenSelectButton_Button"
        className={cn(
          pressable.default,
          'shadow-ock-default',
          'rounded-ock-default',
          border.lineDefault,
          'flex w-fit items-center gap-2 px-3 py-1',
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
              className={cn(text.headline, 'text-ock-text-foreground')}
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
          {isOpen ? caretUpSvg : caretDownSvg}
        </div>
      </button>
    );
  },
);

TokenSelectButton.displayName = 'TokenSelectButton';
