import { cn, text } from '@/styles/theme';
import type { FundCardHeaderPropsReact } from '../types';
import { useFundContext } from './FundCardProvider';

export function FundCardHeader({ className }: FundCardHeaderPropsReact) {
  const { headerText, selectedAsset } = useFundContext();
  const defaultHeaderText = `Buy ${selectedAsset.toUpperCase()}`;

  return (
    <div className={cn(text.headline, className)} data-testid="fundCardHeader">
      {headerText || defaultHeaderText}
    </div>
  );
}
