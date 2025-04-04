'use client';
import { cn, text } from '@/styles/theme';
import type { FundCardHeaderPropsReact } from '../types';
import { useFundContext } from './FundCardProvider';

export function FundCardHeader({ className }: FundCardHeaderPropsReact) {
  const { headerText } = useFundContext();

  return (
    <div
      className={cn(text.headline, className)}
      data-testid="ockFundCardHeader"
    >
      {headerText}
    </div>
  );
}
