import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { cn } from '../../styles/theme';
import type { FundCardHeaderPropsReact } from '../types';

export function FundCardHeader({ headerText, assetSymbol }: FundCardHeaderPropsReact) {
  const componentTheme = useTheme();
  const defaultHeaderText = `Buy ${assetSymbol.toUpperCase()}`;

  return (
    <div
      className={cn(
        componentTheme,
        'font-display text-[16px]',
        'leading-none outline-none'
      )}
      data-testid="fundCardHeader"
    >
      {headerText || defaultHeaderText}
    </div>
  );
}
