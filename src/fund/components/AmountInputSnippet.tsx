import { useCallback, useMemo } from 'react';
import { border, cn, color, text } from '../../styles/theme';
import type { AmountInputSnippetPropsReact } from '../types';

export function AmountInputSnippet({
  amountInputSnippet,
  selectedInputType = 'fiat',
  onClick,
}: AmountInputSnippetPropsReact) {
  // TODO: Get currency label from country (In follow up PR )
  const currencyLabel = selectedInputType === 'fiat' ? 'USD' : 'ETH';

  const buttonText = useMemo(() => {
    return `${amountInputSnippet.value} ${currencyLabel}`;
  }, [amountInputSnippet, currencyLabel]);

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
        // Typography & Colors
        text.body,
        color.foreground,

        // Border styles
        border.radius,
        border.lineDefault,

        // Layout & Sizing
        'inline-block',
        'm-1 p-1',

        // Text overflow handling
        'overflow-hidden',
        'whitespace-nowrap',
        'text-ellipsis',

        // Interactive states
        'hover:bg-[var(--ock-bg-default-hover)]',
        'focus:outline-none focus:ring-2',
      )}
      title={buttonText}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
    >
      {amountInputSnippet.value}
      <span className="pl-1">{currencyLabel}</span>
    </button>
  );
}
