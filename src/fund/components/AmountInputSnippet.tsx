import { useCallback, useMemo } from 'react';
import { border, cn, color, text } from '../../styles/theme';
import type { AmountInputSnippetPropsReact } from '../types';

export function AmountInputSnippet({
  amountInputSnippet,
  onClick,
}: AmountInputSnippetPropsReact) {
  const fullText = useMemo(
    () =>
      amountInputSnippet.type === 'fiat'
        ? `${amountInputSnippet.currencySignOrSymbol}${amountInputSnippet.value}`
        : `${amountInputSnippet.value} ${amountInputSnippet.currencySignOrSymbol}`,
    [amountInputSnippet],
  );

  const handleClick = useCallback(() => {
    onClick(amountInputSnippet);
  }, [amountInputSnippet, onClick]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        onClick(amountInputSnippet);
      }
    },
    [amountInputSnippet, onClick],
  );

  if (!amountInputSnippet.value) {
    return null;
  }

  return (
    <button
      type="button"
      data-testid="ockAmountInputSnippet"
      className={cn(
        // Typography & Colors
        text.body,
        color.foreground,

        // Border styles
        border.radius,
        border.lineDefault,

        // Layout & Sizing
        'inline-block',
        'w-[60px]',
        'm-1 p-1',

        // Text overflow handling
        'overflow-hidden',
        'whitespace-nowrap',
        'text-ellipsis',

        // Interactive states
        'hover:bg-[var(--ock-bg-default-hover)]',
        'focus:outline-none focus:ring-2',
      )}
      title={fullText}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
    >
      {amountInputSnippet.type === 'fiat' && (
        <span>{amountInputSnippet.currencySignOrSymbol}</span>
      )}
      {amountInputSnippet.value}
      {amountInputSnippet.type === 'crypto' && (
        <span className="pl-1">{amountInputSnippet.currencySignOrSymbol}</span>
      )}
    </button>
  );
}
