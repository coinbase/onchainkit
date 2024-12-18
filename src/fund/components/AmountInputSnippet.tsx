import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { border, cn, color, text } from '../../styles/theme';
import type { AmountInputSnippetPropsReact } from '../types';

export function AmountInputSnippet({
    amountInputSnippet,
   onClick,
}: AmountInputSnippetPropsReact) {
  const componentTheme = useTheme();

  return (
    <button
      type="button"
      data-testid="ockAmountInputSnippet"
      className={cn(
        componentTheme,
        text.body,
        border.radius,
        border.lineDefault,
        color.foreground,
        'm-1 p-1 px-2',

      )}
      onClick={() => onClick(amountInputSnippet)}
    >
        {amountInputSnippet.type === 'fiat' && <span> {amountInputSnippet.currencySignOrSymbol}</span>}
        {amountInputSnippet.value}
        {amountInputSnippet.type === 'crypto' && <span className='pl-1'>{amountInputSnippet.currencySignOrSymbol}</span>}
    </button>

  );
}
