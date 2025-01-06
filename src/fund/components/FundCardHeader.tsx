import { cn, text } from '@/styles/theme';
import type { FundCardHeaderPropsReact } from '../types';

export function FundCardHeader({
  headerText,
  assetSymbol,
}: FundCardHeaderPropsReact) {
  const defaultHeaderText = `Buy ${assetSymbol.toUpperCase()}`;

  return (
    <div className={cn(text.headline)} data-testid="fundCardHeader">
      {headerText || defaultHeaderText}
    </div>
  );
}
