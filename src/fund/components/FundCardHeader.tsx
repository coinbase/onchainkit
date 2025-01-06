import type { FundCardHeaderPropsReact } from '../types';

export function FundCardHeader({
  headerText,
  assetSymbol,
}: FundCardHeaderPropsReact) {
  const defaultHeaderText = `Buy ${assetSymbol.toUpperCase()}`;

  return (
    <div
      className="font-display text-base leading-none outline-none"
      data-testid="fundCardHeader"
    >
      {headerText || defaultHeaderText}
    </div>
  );
}
