import { useCallback, useMemo } from 'react';
import { border, cn, color, text } from '../../styles/theme';
import type { AmountInputSnippetPropsReact } from '../types';

export function AmountInputSnippet({
  amountInputSnippet,
  currencyOrAsset,
  onClick,
}: AmountInputSnippetPropsReact) {
  const snippetText = useMemo(() => {
    return `${amountInputSnippet.value} ${currencyOrAsset}`;
  }, [amountInputSnippet, currencyOrAsset]);

  const handleClick = useCallback(() => {
    onClick(amountInputSnippet);
  }, [amountInputSnippet, onClick]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
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
        text.body,
        color.foreground,
        border.radius,
        border.lineDefault,
        'm-1 p-1',
        'overflow-hidden',
        'whitespace-nowrap',
        'text-ellipsis',
        'hover:bg-[var(--ock-bg-default-hover)]',
        'focus:outline-none focus:ring-2',
      )}
      title={snippetText}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
    >
      {snippetText}
    </button>
  );
}
