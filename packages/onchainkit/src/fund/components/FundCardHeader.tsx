'use client';
import { cn, text } from '@/styles/theme';
import type { FundCardHeaderProps } from '../types';
import { useFundContext } from './FundCardProvider';

export function FundCardHeader({ className }: FundCardHeaderProps) {
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
